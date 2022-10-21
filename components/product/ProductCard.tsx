import * as React from "react";

import { useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";

import { RootState } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const ProductCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { purchaseNFT } = useWeb3Transactions();
  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { pendingTransactions } = transactionsSlice;

  const handleClick = () => {
    if (tokenId !== undefined) purchaseNFT(tokenId, description, name);
  };

  const pending = pendingTransactions.some((txn) => txn.tokenId === tokenId);

  const disabled =
    !(owner === process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS) || pending;

  return (
    <PokemonCard
      pending={pending}
      disabled={disabled}
      buttonText="buy"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default ProductCard;
