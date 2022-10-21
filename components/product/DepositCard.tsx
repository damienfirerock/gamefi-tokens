import * as React from "react";

import PokemonCard from "./common/PokemonCard";

import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const DepositCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { depositPokemon } = useWeb3Transactions();

  const handleClick = () => {
    if (tokenId !== undefined) depositPokemon(tokenId, description, name);
  };

  const disabled = !(owner === process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS);

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="deposit"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default DepositCard;
