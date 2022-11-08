import * as React from "react";
import { useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";

import { RootState } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const RemoveListingCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId } = props;

  const { withdrawFromMarketPlace, acceptInMarketPlace } =
    useWeb3Transactions();

  const { details: offers } = useSelector(
    (state: RootState) => state.marketPlaceProducts
  );

  const hasOffer = offers?.find(
    (element) => element.tokenId === tokenId
  )?.buyerDeposit;

  const handleClick = () => {
    if (tokenId !== undefined)
      hasOffer
        ? acceptInMarketPlace(tokenId, description, name)
        : withdrawFromMarketPlace(tokenId, description, name);
  };

  const disabled = false;

  return (
    <PokemonCard
      disabled={disabled}
      buttonText={hasOffer ? "Accept" : "withdraw"}
      handleClick={handleClick}
      {...props}
    />
  );
};

export default RemoveListingCard;
