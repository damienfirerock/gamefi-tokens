export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// roles are generated from keccak hashes
// Therefore, the only way to compare would be to check against all role hashes in contracts
// 1 way would be to request for all role data from the relevant address when the transaction is requested
// Other way would be to list the keccak hashes in a constants file
// Second way seems more do-able since smart contract roles are unlikely to change much
export const KECCAK_ROLES: Record<string, string> = {
  "0x0000000000000000000000000000000000000000000000000000000000000000":
    "Default Admin",
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6":
    "Minter",
};

export const DEFAULT_DECIMALS = 18;
