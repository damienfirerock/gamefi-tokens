import * as React from "react";

import PokemonCard from "./common/PokemonCard";

import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const RemoveListingCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId } = props;

  const { withdrawFromMarketPlace } = useWeb3Transactions();

  const handleClick = () => {
    if (tokenId !== undefined)
      withdrawFromMarketPlace(tokenId, description, name);
  };

  const disabled = false;

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="withdraw"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default RemoveListingCard;
