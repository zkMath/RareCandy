export enum Tier {
  Base = 0,
  MidLow = 1,
  Mid = 2,
  High = 3,
  Legendary = 4,
}

export enum PullOutcome {
  Kept = "kept",
  SoldBack = "sold_back",
  Listed = "listed",
  Redeemed = "redeemed",
}

export enum RedemptionStatus {
  Pending = "pending",
  Dispatched = "dispatched",
  Delivered = "delivered",
}

export enum OracleConfidence {
  High = "HIGH",
  Medium = "MEDIUM",
  Low = "LOW",
}

export enum PullState {
  Idle = "idle",
  CheckingBalance = "checking_balance",
  Approving = "approving",
  Pulling = "pulling",
  AwaitingVRF = "awaiting_vrf",
  Revealed = "revealed",
  Error = "error",
}
