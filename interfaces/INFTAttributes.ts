// https://docs.opensea.io/docs/metadata-standards

export enum Collection {
  Skins = "skins",
}

export enum DisplayType {
  BoostNumber = "boost_number",
  BoostPercentage = "boost_percentage",
  Date = "date",
}

export enum RarityEnglish {
  Common = "Common",
  Rare = "Rare",
  SuperRare = "Super-Rare",
  Founder = "Founder",
}

export enum RarityChinese {
  Common = "常见",
  Rare = "稀有",
  SuperRare = "超稀有",
  Founder = "创始者",
}

export interface ICharacterSkinAttributes {
  contract: string;
  collection: Collection.Skins;
  tokenId: number;
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
