import {
  DisplayType,
  RarityChinese,
  ICharacterSkinAttributes,
} from "../../../interfaces/INFTAttributes";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const imageURL = NEXT_PUBLIC_BACKEND_URL + "/nft/skin/images/";
const infoURL = NEXT_PUBLIC_BACKEND_URL + "/nft/info/skin/zh/"; // TODO: Replace with Marketplace Link once up

const CHINESE_TOKEN_IDS: Record<number, ICharacterSkinAttributes> = {
  0: {
    name: "孙悟空-1",
    image: imageURL + "0",
    external_url: infoURL + "0",
    description: "XY3游戏中悟空角色的创始者皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.Founder,
      },
      {
        trait_type: "元素",
        value: "火",
      },
      {
        trait_type: "攻击",
        value: 9999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 99,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  1: {
    name: "孙悟空-2",
    image: imageURL + "1",
    external_url: infoURL + "1",
    description: "XY3游戏中悟空角色的超稀有皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.SuperRare,
      },
      {
        trait_type: "元素",
        value: "金",
      },
      {
        trait_type: "攻击",
        value: 999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 80,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  2: {
    name: "孙悟空-3",
    image: imageURL + "2",
    external_url: infoURL + "2",
    description: "XY3游戏中悟空角色的稀有皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.Rare,
      },
      {
        trait_type: "元素",
        value: "水",
      },
      {
        trait_type: "攻击",
        value: 99,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 50,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  3: {
    name: "孙悟空-4",
    image: imageURL + "3",
    external_url: infoURL + "3",
    description: "XY3游戏中悟空角色的常见皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.Common,
      },
      {
        trait_type: "元素",
        value: "地",
      },
      {
        trait_type: "攻击",
        value: 9,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 25,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  4: {
    name: "三藏法师-1",
    image: imageURL + "4",
    external_url: infoURL + "4",
    description: "XY3游戏中三藏法师角色的创始者皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.Founder,
      },
      {
        trait_type: "元素",
        value: "火",
      },
      {
        trait_type: "攻击",
        value: 99999,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 100,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
  5: {
    name: "三藏法师-2",
    image: imageURL + "5",
    external_url: infoURL + "5",
    description: "XY3游戏中三藏法师角色的超稀有皮肤",
    attributes: [
      {
        trait_type: "稀有度",
        value: RarityChinese.SuperRare,
      },
      {
        trait_type: "元素",
        value: "金",
      },
      {
        trait_type: "攻击",
        value: 8888,
        display_type: DisplayType.BoostNumber,
      },
      {
        trait_type: "生命",
        value: 88,
        max_value: 100,
        display_type: DisplayType.BoostPercentage,
      },
    ],
  },
};

export default CHINESE_TOKEN_IDS;
