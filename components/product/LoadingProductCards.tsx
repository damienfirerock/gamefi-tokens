import * as React from "react";

import SkeletonProductCard from "./common/SkeletonProductCard";

const LoadingProductCards: React.FunctionComponent = () => {
  const skeletonCards = Array.from(Array(18).keys()).map((element) => (
    <SkeletonProductCard key={element} />
  ));
  return <>{skeletonCards}</>;
};

export default LoadingProductCards;
