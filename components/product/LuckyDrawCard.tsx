import * as React from "react";

import PokemonCard from "./common/PokemonCard";

import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const LuckyDrawCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { depositPokemon } = useWeb3Transactions();

  const handleClick = () => {
    if (tokenId !== undefined) depositPokemon(tokenId, description, name);
  };

  const disabled = owner === process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS;

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="Enter"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default LuckyDrawCard;
