export enum TransactionType {
  TokenSalePurchase = "Token Sale Purchase",
  MarketPlaceOffer = "MarketPlace Offer",
  MarketPlaceDeposit = "MarketPlace Deposit",
  LuckyDrawEnter = "Enter Lucky Draw",
  StakingDeposit = "Staking Deposit",
  StakingWithdrawal = "Staking Withdrawal",
  StakingRedemption = "StakingRedemption",
}
export interface ITransaction {
  from: string;
  to: string;
  transactionHash: string;
  tokenId?: number;
  category: TransactionType;
}

export interface IPendingTransaction {
  tokenId: number;
  description: string;
  name: string;
  type: TransactionType;
}

export interface IPendingTransactions {
  tokenSales: IPendingTransaction[];
}
