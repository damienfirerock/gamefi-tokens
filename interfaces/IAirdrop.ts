export type IAirDropDetails = {
  decimals: number;
  airdrop: Record<string, number>;
};

export enum AirdropType {
  SINGLE_USE,
  CUMULATIVE,
}
