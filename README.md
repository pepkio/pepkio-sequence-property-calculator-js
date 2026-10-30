# Sequence Property Calculator

Node.js ESM client and CLI for running Pepkio's sequence, dilution, and ligation calculations through one typed REST API package.

# What It Does

This package calls the hosted Pepkio Sequence Property Calculator from Node.js scripts, browser bundles, or CI workflows. You can submit mixed FASTA input for sequence-property analysis, run concentration dilution calculations, or compute ligation insert mass from vector and insert settings.

The API runs in synchronous mode and returns structured JSON output for each run. Programmatic runs require a network connection and a Pepkio API key.

# Features

- Three tool modes via `mode`: `sequence`, `dilution`, `ligation`
- Sequence mode supports multi-FASTA input with options like `mass_type`, `topology`, `strand_mode`, and `type_overrides`
- Sequence outputs include fields such as molecular weight, GC%, pI, extinction coefficients, GRAVY, and instability index
- Dilution mode supports `simple` and `serial` sub-modes and returns protocol steps
- Ligation mode returns calculated `insert_mass_ng`
- Built-in manifest helpers: `getManifest`, `listExamples`, `getExampleInput`
- Run helpers: `run`, `getRun`, `waitForRun`
- CLI commands: `manifest` and `run`

# Installation

```bash
npm install pepkio-sequence-property-calculator
```

Requires Node.js 18 or newer.

# Configuration

Set an API key with `tools:run` scope before calling `run()`:

```bash
export PEPKIO_API_KEY="your-key"
```

Create a key at [Pepkio API keys](https://www.pepkio.com/account/api-keys).

Optional environment variables:

- `PEPKIO_API_BASE_URL` (default: `https://tools.pepkio.com`)
- `LOCAL_PEPKIO_API_KEY` (used when base URL points to `localtest.me`)
- `PEPKIO_SSL_VERIFY` (`0` or `false` disables TLS verification)

# Quick Example

```typescript
import { PepkioClient } from "pepkio-sequence-property-calculator";

const client = new PepkioClient({ apiKey: process.env.PEPKIO_API_KEY });

const input = await client.getExampleInput("mixed_fasta");
const result = await client.run(input);

console.log(result.status);
console.log(result.result?.mode);
console.log(result.result?.valid_count);
```

# CLI

```bash
npx pepkio-sequence-property-calculator manifest --examples
npx pepkio-sequence-property-calculator run --example mixed_fasta
```

# Typical Use Cases

- Batch-check molecular properties for mixed DNA, RNA, and protein FASTA entries
- Review protein constructs with molecular weight and pI in one API workflow
- Run oligo property checks including GC-related outputs and extinction values
- Plan dilution steps from stock and target concentrations
- Calculate insert mass for cloning ligation setups

# Scientific Background

Sequence mode detects nucleic acid or protein input and computes properties per row. Protein pI is estimated with Bjellqvist pKa tables, and ligation mass follows the ratio-based formula used by the tool (`molarRatio * (insertLength / vectorLength) * vectorMass`). Dilution mode applies concentration-volume conversion workflows for simple and serial planning.

# Web Application

For researchers who prefer a graphical interface, an interactive web version is available.

Web Application: https://www.pepkio.com/tools/sequence-property-calculator

The web interface provides live table updates, CSV export, shareable permalinks, row-level concentration utilities, and integrated dilution and ligation tabs.

# Documentation and Resources

GitHub Repository: https://github.com/pepkio/pepkio-sequence-property-calculator-js

Web Application: https://www.pepkio.com/tools/sequence-property-calculator

# About Pepkio

Pepkio (https://www.pepkio.com/) develops software tools and bioinformatics solutions for life science researchers, including laboratory calculators and analysis services (https://www.pepkio.com/cro).
