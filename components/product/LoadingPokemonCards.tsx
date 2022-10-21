import * as React from "react";

import SkeletonPokemonCard from "./common/SkeletonPokemonCard";

const LoadingPokemonCards: React.FunctionComponent = () => {
  const skeletonCards = Array.from(Array(18).keys()).map((element) => (
    <SkeletonPokemonCard key={element} />
  ));
  return <>{skeletonCards}</>;
};

export default LoadingPokemonCards;
