/** Integration tests against live Pepkio Tools API. */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { describe, expect, it } from "vitest";

import { PepkioClient } from "../src/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load monorepo .env for local integration runs (never log keys).
const monorepoEnv = resolve(__dirname, "../../../.env");
if (existsSync(monorepoEnv)) {
  loadEnv({ path: monorepoEnv });
}

const packageEnv = resolve(__dirname, "../.env");
if (existsSync(packageEnv)) {
  loadEnv({ path: packageEnv });
}

const ENVIRONMENTS = [
  { name: "local", baseUrl: "https://tools.localtest.me" },
  { name: "production", baseUrl: "https://tools.pepkio.com" },
] as const;

function apiKeyFor(baseUrl: string): string | undefined {
  if (baseUrl.includes("localtest.me")) {
    return process.env.LOCAL_PEPKIO_API_KEY ?? process.env.PEPKIO_API_KEY;
  }
  return process.env.PEPKIO_API_KEY;
}

function clientFor(env: (typeof ENVIRONMENTS)[number]): PepkioClient | null {
  const apiKey = apiKeyFor(env.baseUrl);
  if (!apiKey) {
    return null;
  }
  return new PepkioClient({ apiKey, baseUrl: env.baseUrl });
}

describe.each(ENVIRONMENTS)("$name integration", (env) => {
  const client = clientFor(env);
  const maybeIt = client ? it : it.skip;

  maybeIt("fetches manifest", async () => {
    const manifest = await client!.getManifest({ refresh: true });
    expect(manifest.tool_id).toBe("sequence-property-calculator");
    const names = await client!.listExamples();
    expect(names).toContain("mixed_fasta");
  });

  maybeIt("runs mixed_fasta example", async () => {
    const input = await client!.getExampleInput("mixed_fasta");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.run_id).toBeTruthy();
    expect(result.permalink).toBeTruthy();
    expect(result.result).toBeTruthy();
    expect(result.result?.mode).toBe("sequence");
    expect(Array.isArray(result.result?.rows)).toBe(true);
    expect(result.result?.valid_count).toBeGreaterThanOrEqual(1);
    expect(result.result?.error).toBeUndefined();
  });

  maybeIt("runs dilution_simple example", async () => {
    const input = await client!.getExampleInput("dilution_simple");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.result?.mode).toBe("dilution");
  });

  maybeIt("runs ligation_1to3 example", async () => {
    const input = await client!.getExampleInput("ligation_1to3");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.result?.mode).toBe("ligation");
    expect(typeof result.result?.insert_mass_ng).toBe("number");
  });
});
