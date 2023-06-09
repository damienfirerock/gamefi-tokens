import { ethers } from "ethers";

export const truncateString = (address: string, show = 4) => {
  if (address.length <= show * 2) return address;

  const start = address.substring(0, show);
  const end = address.substring(address.length - show, address.length);

  return `${start}...${end}`;
};

export const capitaliseString = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const handleOpenWindow = (url: string) => {
  window.open(url, "_blank", "noopener");
};

export const formatTokenValue = (value: string, decimals: number) => {
  return ethers.utils.formatUnits(value, decimals);
};

export const formatNumberValue = (value: number): string => {
  let result = "";
  if (value >= 1_000_000) {
    result = (value / 1_000_000).toFixed(2) + "MM";
  } else if (value >= 1_000) {
    result = (value / 1_000).toFixed(2) + "K";
  } else {
    result = value.toFixed(4);
  }

  // Remove trailing zeros if there is a decimal point
  if (result.includes(".")) {
    result = parseFloat(result).toString();
  }

  return result;
};

export const parseTokenValue = (value: string, decimals: number) => {
  return ethers.utils.parseUnits(value, decimals);
};
