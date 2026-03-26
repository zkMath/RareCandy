export const FMV_ORACLE_ABI = [
  // Read functions
  {
    name: "getPrice",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "cardType", type: "string" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "prices",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "cardType", type: "string" }],
    outputs: [
      { name: "fmvUsd6", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "confidence", type: "uint256" },
    ],
  },
  {
    name: "maxStaleness",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "operator",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  // Write functions
  {
    name: "updatePrice",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "cardType", type: "string" },
      { name: "fmvUsd6", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "batchUpdatePrices",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "cardTypes", type: "string[]" },
      { name: "fmvs", type: "uint256[]" },
    ],
    outputs: [],
  },
  // Events
  {
    name: "PriceUpdated",
    type: "event",
    inputs: [
      { name: "cardType", type: "string", indexed: false },
      { name: "fmvUsd6", type: "uint256", indexed: false },
      { name: "updatedAt", type: "uint256", indexed: false },
    ],
  },
] as const;
