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
import { useSelector } from "react-redux";

import Layout from "../layout/Layout";
import { Header } from "../common";
import ArenaCard from "../product/ArenaCard";

import { RootState } from "../../store";
import { ZERO_ADDRESS } from "../../constants";
import { PokemonType } from "../../interfaces/IArena";

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
  const arenaSlice = useSelector((state: RootState) => state.arena);
  const { data } = arenaSlice;

  console.log({ data });

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

        <StyledBox>
          <Header text="Claim Experience Points" variant="h4" />
        </StyledBox>

        {/* <StyledBox>
          <Header
            text={
              entrantsLoading
                ? "Getting Players..."
                : `There ${entrants?.length === 1 ? "is" : "are"} currently ${
                    entrants?.length || 0
                  } player${
                    entrants?.length === 1 ? "" : "s"
                  } in the lucky draw`
            }
            variant="h4"
          />
        </StyledBox> */}
      </StyledContainer>
    </Layout>
  );
};

export default LuckyDraw;
