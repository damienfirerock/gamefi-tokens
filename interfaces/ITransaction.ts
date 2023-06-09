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

export enum HubTransactionStatus {
  Success = "Success",
  Failure = "Failure",
  Pending = "Pending",
}
export interface IHubTransaction {
  transactionType: HubTransactionType;
  hash: string;
  server: string;
  amount: number;
  status: HubTransactionStatus;
  createdAt: string;
}
