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
