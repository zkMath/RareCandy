export const GACHA_MACHINE_ABI = [
  // Read functions
  {
    name: "pullPrice",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "tierOdds",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getTierPoolLength",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tier", type: "uint8" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getTierPoolTokenId",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "tier", type: "uint8" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "usdcToken",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "treasury",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  // Write functions
  {
    name: "pull",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "requestId", type: "uint256" }],
  },
  // Events
  {
    name: "PullRequested",
    type: "event",
    inputs: [
      { name: "requestId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
    ],
  },
  {
    name: "PullCompleted",
    type: "event",
    inputs: [
      { name: "requestId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: false },
      { name: "tier", type: "uint8", indexed: false },
      { name: "fmv", type: "uint256", indexed: false },
    ],
  },
] as const;
