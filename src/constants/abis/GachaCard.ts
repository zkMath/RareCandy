export const GACHA_CARD_ABI = [
  // Read functions
  {
    name: "cards",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "psaCert", type: "string" },
      { name: "cardName", type: "string" },
      { name: "tier", type: "uint8" },
      { name: "fmvAtMint", type: "uint256" },
      { name: "mintedAt", type: "uint256" },
      { name: "redeemed", type: "bool" },
    ],
  },
  {
    name: "inPool",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "buybackEligible",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  // Write functions
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "mintCard",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      {
        name: "data",
        type: "tuple",
        components: [
          { name: "psaCert", type: "string" },
          { name: "cardName", type: "string" },
          { name: "tier", type: "uint8" },
          { name: "fmvAtMint", type: "uint256" },
          { name: "mintedAt", type: "uint256" },
          { name: "redeemed", type: "bool" },
        ],
      },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    name: "markRedeemed",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  // Events
  {
    name: "CardMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "psaCert", type: "string", indexed: false },
      { name: "tier", type: "uint8", indexed: false },
    ],
  },
  {
    name: "CardPulled",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "pullPrice", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CardReturnedToPool",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "buybackAmount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CardRedeemed",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
    ],
  },
] as const;
