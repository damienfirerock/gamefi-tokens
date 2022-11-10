import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";

import { AppDispatch, RootState } from "../../store";
import { PokemonType } from "../views/Arena";
import { enterArena } from "../../features/ArenaSlice";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

interface IPokemon {
  name: string;
  description: PokemonType;
  image: string;
  owner: string;
}

const ArenaCard: React.FunctionComponent<IPokemon> = (props) => {
  const { name, description } = props;

  const { enterLuckyDraw } = useWeb3Transactions();

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = async () => {
    dispatch(enterArena(description));
  };

  const disabled = false;

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="Select"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default ArenaCard;
