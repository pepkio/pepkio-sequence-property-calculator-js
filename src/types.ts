// SPDX-License-Identifier: MIT
/** Typed API request/response models. */

import { z } from "zod";

import { PepkioAPIError } from "./errors.js";

export const RunResultSchema = z
  .object({
    run_id: z.string(),
    status: z.string(),
    result: z.record(z.unknown()).nullable().optional(),
    error: z
      .object({
        code: z.string().optional(),
        message: z.string().optional(),
        details: z.record(z.unknown()).optional(),
      })
      .nullable()
      .optional(),
    result_url: z.string().nullable().optional(),
    permalink: z.string().nullable().optional(),
    duration_ms: z.number().nullable().optional(),
  })
  .passthrough();

export type RunResult = z.infer<typeof RunResultSchema>;

export function parseRunResponse(data: Record<string, unknown>): RunResult {
  return RunResultSchema.parse(data);
}

export function raiseForError(result: RunResult): void {
  if (!result.error) {
    return;
  }
  const err = result.error;
  throw new PepkioAPIError(err.message ?? "Tool run failed", {
    code: err.code,
    responseBody: {
      run_id: result.run_id,
      status: result.status,
      error: result.error,
    },
  });
}
