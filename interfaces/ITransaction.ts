export interface ITransaction {
  to: string;
  value: number;
  data: string;
  executed: number;
  confirations: number;
}

export interface ISignatureDetails {
  hash: any;
  txIndex: number;
  address: string;
  nonce: number;
}
