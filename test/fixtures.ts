export const mockManifest: Record<string, unknown> = {
  tool_id: "sequence-property-calculator",
  title: "Sequence Property Calculator",
  execution_mode: "sync",
  examples: [
    {
      name: "mixed_fasta",
      input: {
        mode: "sequence",
        fasta_text:
          ">dna_oligo\nATCGATCGATCGATCG\n>insulin_b\nFVNQHLCGSHLVEALYLVCGERGFFYTPKT\n",
        mass_type: "average",
        topology: "linear",
      },
    },
  ],
};

export const mockRunResponse: Record<string, unknown> = {
  run_id: "run_test123",
  status: "completed",
  result: {
    mode: "sequence",
    rows: [{ name: "dna_oligo" }, { name: "insulin_b" }],
    valid_count: 2,
  },
  error: null,
  result_url: "https://tools.pepkio.com/api/tools/v1/runs/run_test123",
  permalink: "https://tools.pepkio.com/r/run_test123",
};
