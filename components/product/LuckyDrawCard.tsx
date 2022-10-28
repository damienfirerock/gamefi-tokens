import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";

import { AppDispatch, RootState } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import { fetchLuckyDrawEntrants } from "../../features/LuckyDrawEntrantsSlice";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const LuckyDrawCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { account } = useConnectWallet();
  const { enterLuckyDraw } = useWeb3Transactions();

  const dispatch = useDispatch<AppDispatch>();
  const luckyDrawEntrantsSlice = useSelector(
    (state: RootState) => state.luckyDrawEntrants
  );
  const { data: entrants } = luckyDrawEntrantsSlice;

  const handleClick = async () => {
    if (tokenId !== undefined) {
      await enterLuckyDraw(tokenId, description, name);
      dispatch(fetchLuckyDrawEntrants());
    }
  };

  const disabled =
    owner !== process.env.NEXT_PUBLIC_LUCKY_DRAW_ADDRESS ||
    !!entrants?.includes(account || "");

  const buttonText = !!entrants?.includes(account || "") ? "Entered" : "Enter";

  return (
    <PokemonCard
      disabled={disabled}
      buttonText={buttonText}
      handleClick={handleClick}
      {...props}
    />
  );
};

export default LuckyDrawCard;
