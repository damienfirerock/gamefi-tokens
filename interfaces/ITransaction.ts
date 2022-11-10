export enum TransactionType {
  TokenSalePurchase = "Token Sale Purchase",
  MarketPlaceOffer = "MarketPlace Offer",
  MarketPlaceListing = "MarketPlace Listing",
  MarketPlaceWithdrawal = "MarketPlace Withdrawal",
  MarketPlaceAccept = "MarketPlace Accept",
  LuckyDrawEnter = "Enter Lucky Draw",
  StakingDeposit = "Staking Deposit",
  StakingWithdrawal = "Staking Withdrawal",
  StakingRedemption = "Staking Redemption",
  YieldWithdrawal = "Yield Withdrawal",
  LuckyDraw = "Lucky Draw",
  ArenaEnter = "Enter Arena",
  ClaimExp = "Claim Exp Points",
}
export interface ITransaction {
  from: string;
  to: string;
  transactionHash: string;
  tokenId?: number;
  category: TransactionType;
}

export interface IPendingTransaction {
  tokenId?: number;
  description?: string;
  name?: string;
  type: TransactionType;
}
