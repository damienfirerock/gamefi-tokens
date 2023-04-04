import ENGLISH_SKINS_TOKEN_IDS from "./nft/skins/en/token-ids";
import CHINESE_SKINS_TOKEN_IDS from "./nft/skins/zh/token-ids";

const { NEXT_PUBLIC_CHARACTER_SKIN_ADDRESS } = process.env;
const NFT_COLLECTIONS = {
  skins: {
    address: NEXT_PUBLIC_CHARACTER_SKIN_ADDRESS,
    info: { en: ENGLISH_SKINS_TOKEN_IDS, zh: CHINESE_SKINS_TOKEN_IDS },
  },
};

export default NFT_COLLECTIONS;
