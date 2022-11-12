import React from "react";
import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import { Header } from "../common";
import ExpPointBalance from "../arena/ExpPointsBalance";
import ArenaCard from "../product/ArenaCard";
import AlertBar from "../common/AlertBar";

import { AppDispatch, RootState } from "../../store";
import { ZERO_ADDRESS } from "../../constants";
import { PokemonType } from "../../interfaces/IArena";
import { clearError } from "../../features/ArenaSlice";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const StyledResults = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(4, 0),
}));

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  paddingBottom: theme.spacing(10),
}));

const CardsBox = styled(Container)<ContainerProps>(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
}));

const options = [
  {
    tokenId: 0,
    owner: ZERO_ADDRESS,
    name: "venusaur",
    description: PokemonType.PLANT,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
  },
  {
    tokenId: 0,
    owner: ZERO_ADDRESS,
    name: "charizard",
    description: PokemonType.FIRE,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  },
  {
    tokenId: 0,
    owner: ZERO_ADDRESS,
    name: "blastoise",
    description: PokemonType.WATER,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
  },
];

const { NEXT_PUBLIC_ARENA_ADDRESS } = process.env;

const LuckyDraw: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const arenaSlice = useSelector((state: RootState) => state.arena);

  const { data, error } = arenaSlice;

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">
            <Link
              href={`https://goerli.etherscan.io/address/${NEXT_PUBLIC_ARENA_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Arena
            </Link>
          </Typography>
        </StyledBox>
        <StyledBox>
          <Header
            text={"Plant beats Water, Water beats Fire, Fire beats Plant"}
            variant="h4"
          />
        </StyledBox>

        <CardsBox>
          {options.map((element) => (
            <ArenaCard key={element.name} {...element} />
          ))}
        </CardsBox>

        {data && (
          <StyledResults>
            <Header text="Results" variant="h4" />

            <Header text={`${data.outcome}!`} variant="h6" />

            <Header
              text={`Computer chose ${data.serverAction}!`}
              variant="h6"
            />
          </StyledResults>
        )}

        <ExpPointBalance />
      </StyledContainer>

      <AlertBar
        severity="warning"
        text={error}
        handleClearAlertSource={() => dispatch(clearError())}
      />
    </Layout>
  );
};

export default LuckyDraw;
