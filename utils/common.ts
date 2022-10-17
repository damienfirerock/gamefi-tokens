const totalLength = 8;
const revealedLength = totalLength / 2;

export const truncateWalletAddress = (address: string) => {
  if (address.length <= totalLength) return address;

  const start = address.substring(0, revealedLength);
  const end = address.substring(
    address.length - revealedLength,
    address.length
  );

  return `${start}...${end}`;
};
