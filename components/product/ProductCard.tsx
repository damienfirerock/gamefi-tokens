import * as React from "react";

import PokemonCard from "./common/PokemonCard";

import { IProduct } from "../../interfaces/IProduct";
// import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const ProductCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  // const { purchaseNFT } = useWeb3Transactions();

  const handleClick = () => {
    // if (tokenId !== undefined) purchaseNFT(tokenId, description, name);
  };

  const disabled = !(
    owner === process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS
  );

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="buy"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default ProductCard;
