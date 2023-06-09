export interface ITransaction {
  to: string;
  value: number;
  data: string;
  executed: boolean;
  confirmations: number;
}

export interface IUserTransaction extends ITransaction {
  userConfirmed: boolean;
}

export interface ISignatureDetails {
  hash: any;
  txIndex: number;
  address: string;
  nonce: number;
}

export enum HubTransactionType {
  Deposit = "Deposit",
  Withdrawal = "Withdrawal",
}
export interface IHubTransaction {
  transactionType: HubTransactionType;
  hash: string;
  server: string;
  amount: number;
  status: string;
  createdAt: string;
}
