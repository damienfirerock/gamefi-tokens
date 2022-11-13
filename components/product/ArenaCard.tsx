import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";
import {
  addPendingTransaction,
  removePendingTransaction,
} from "../../features/TransactionsSlice";

import { AppDispatch, RootState } from "../../store";
import { PokemonType } from "../../interfaces/IArena";
import { enterArena } from "../../features/ArenaSlice";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import useDispatchErrors from "../../utils/hooks/useDispatchErrors";

import { TransactionType } from "../../interfaces/ITransaction";

interface IPokemon {
  tokenId: number;
  name: string;
  description: PokemonType;
  image: string;
  owner: string;
}

const ArenaCard: React.FunctionComponent<IPokemon> = (props) => {
  const { name, description, tokenId } = props;

  const { account } = useConnectWallet();
  const { sendTransactionError } = useDispatchErrors();

  const dispatch = useDispatch<AppDispatch>();

  const arenaSlice = useSelector((state: RootState) => state.arena);
  const { loading } = arenaSlice;

  const handleClick = async () => {
    if (!account) {
      sendTransactionError("Please connect MetaMask");
      return;
    }

    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.ArenaEnter,
    };

    dispatch(addPendingTransaction(nextTransaction));
    await dispatch(enterArena({ type: description, address: account }));
    dispatch(removePendingTransaction(nextTransaction));
  };

  return (
    <PokemonCard
      disabled={loading}
      buttonText="Select"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default ArenaCard;
