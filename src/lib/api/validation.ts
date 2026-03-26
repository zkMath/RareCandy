import { z } from "zod";

export const redeemSchema = z.object({
  tokenId: z.number().int().positive(),
  shippingName: z.string().min(1).max(200),
  shippingAddress: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postcode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  }),
  feeTxHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

export const mintSchema = z.object({
  psaCert: z.string().min(1),
  cardName: z.string().min(1),
  setCode: z.string().min(1),
  tier: z.number().int().min(0).max(4),
  fmvUsdCents: z.number().int().positive(),
  metadataCID: z.string().min(1),
});

export const oracleUpdateSchema = z.object({
  cardTypeKeys: z.array(z.string()).optional(),
});
