import {
  DisplayType,
  RarityEnglish,
  ICharacterSkinAttributes,
} from "../../../../interfaces/INFTAttributes";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const imageURL = NEXT_PUBLIC_BACKEND_URL + "/nft/skins/images/";
const infoURL = NEXT_PUBLIC_BACKEND_URL + "/nft/skins/info/en/"; // TODO: Replace with Marketplace Link once up

const ENGLISH_TOKEN_IDS: Record<number, ICharacterSkinAttributes> = {
  0: {
    name: "SunWuKong-1",
    image: imageURL + "0",
    external_url: infoURL + "0",
    description: "Founder's Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.Founder,
      },
      {
        trait_type: "Element",
        value: "Fire",
      },
      {
        trait_type: "ATK",
        value: 9999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 99,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  1: {
    name: "SunWuKong-2",
    image: imageURL + "1",
    external_url: infoURL + "1",
    description: "Super-Rare Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.SuperRare,
      },
      {
        trait_type: "Element",
        value: "Gold",
      },
      {
        trait_type: "ATK",
        value: 999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 80,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  2: {
    name: "SunWuKong-3",
    image: imageURL + "2",
    external_url: infoURL + "2",
    description: "Rare Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.Rare,
      },
      {
        trait_type: "Element",
        value: "Water",
      },
      {
        trait_type: "ATK",
        value: 99,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 50,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  3: {
    name: "SunWuKong-4",
    image: imageURL + "3",
    external_url: infoURL + "3",
    description: "Common Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.Common,
      },
      {
        trait_type: "Element",
        value: "Earth",
      },
      {
        trait_type: "ATK",
        value: 9,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 25,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  4: {
    name: "Tripitaka-1",
    image: imageURL + "4",
    external_url: infoURL + "4",
    description: "Common Skin for the Tripitaka Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.Founder,
      },
      {
        trait_type: "Element",
        value: "Fire",
      },
      {
        trait_type: "ATK",
        value: 99999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 100,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  5: {
    name: "Tripitaka-2",
    image: imageURL + "5",
    external_url: infoURL + "5",
    description: "Super Rare Skin for the Tripitaka Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: RarityEnglish.SuperRare,
      },
      {
        trait_type: "Element",
        value: "Fire",
      },
      {
        trait_type: "ATK",
        value: 99999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "Health",
        value: 100,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
};

export default ENGLISH_TOKEN_IDS;
