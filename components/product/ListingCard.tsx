import * as React from "react";

import PokemonCard from "./common/PokemonCard";

import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const ListingCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { listOnMarketPlace } = useWeb3Transactions();

  const handleClick = () => {
    if (tokenId !== undefined) listOnMarketPlace(tokenId, description, name);
  };

  const disabled = owner === process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS;

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="list"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default ListingCard;
