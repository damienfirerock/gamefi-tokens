import { ethers } from "ethers";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";

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
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "MM";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  } else {
    const nextValue = value.toFixed(4);
    return parseFloat(nextValue).toString();
  }
};

export const parseTokenValue = (value: string, decimals: number) => {
  return ethers.utils.parseUnits(value, decimals);
};

export const formatDateWithLocale = (locale: string, date: Date): string => {
  switch (locale) {
    case "en":
      dayjs.locale("en");
      break;
    case "zh":
      dayjs.locale("zh-cn");
      break;
    default:
      dayjs.locale("en");
  }

  const formattedDate = dayjs(date).format("DD MMM YY");

  return formattedDate;
};
