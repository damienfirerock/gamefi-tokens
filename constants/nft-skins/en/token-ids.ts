// https://docs.opensea.io/docs/metadata-standards

enum DisplayType {
  BoostNumber = "boost_number",
  BoostPercentage = "boost_percentage",
  Date = "date",
}

export interface CharacterSkinAttributes {
  name: string;
  image: string;
  external_url: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string | number;
    display_type?: DisplayType;
    max_value?: number;
  }[];
}

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const imageURL = NEXT_PUBLIC_BACKEND_URL + "/nft/skin/images/";
const infoURL = NEXT_PUBLIC_BACKEND_URL + "/nft/info/skin/en/"; // TODO: Replace with Marketplace Link once up

const ENGLISH_TOKEN_IDS: Record<number, CharacterSkinAttributes> = {
  1: {
    name: "SunWuKong-1",
    image: imageURL + "1",
    external_url: infoURL + "1",
    description: "Founder's Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Founder",
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
  2: {
    name: "SunWuKong-2",
    image: imageURL + "2",
    external_url: infoURL + "2",
    description: "Super-Rare Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Super-Rare",
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
  3: {
    name: "SunWuKong-3",
    image: imageURL + "3",
    external_url: infoURL + "3",
    description: "Rare Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Rare",
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
  4: {
    name: "SunWuKong-4",
    image: imageURL + "4",
    external_url: infoURL + "4",
    description: "Common Skin for the Wu Kong Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Common",
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
  5: {
    name: "Tripitaka-1",
    image: imageURL + "5",
    external_url: infoURL + "5",
    description: "Common Skin for the Tripitaka Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Founder",
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
  6: {
    name: "Tripitaka-2",
    image: imageURL + "6",
    external_url: infoURL + "6",
    description: "Common Skin for the Tripitaka Character in XY3",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Founder",
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
