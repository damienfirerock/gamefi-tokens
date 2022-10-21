import * as React from "react";
import { Skeleton } from "@mui/material";

import { StyledCard, StyledCardContent } from "./PokemonCard";

const SkeletonCard: React.FunctionComponent = () => {
  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <Skeleton height={40} width="80%" style={{ marginBottom: 6 }} />
        <Skeleton height={20} width="80%" style={{ marginBottom: 6 }} />
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          style={{ marginBottom: 6 }}
        />
        <Skeleton height={20} width="80%" style={{ marginBottom: 6 }} />
        <Skeleton height={40} width="80%" style={{ marginBottom: 6 }} />
      </StyledCardContent>
    </StyledCard>
  );
};

export default SkeletonCard;
