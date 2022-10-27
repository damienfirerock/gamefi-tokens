import { IProduct } from "../interfaces/IProduct";

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

export const sortProductsByDescription = (array: IProduct[]) => {
  const nextArray = array.sort(
    (a, b) => parseInt(a.description) - parseInt(b.description)
  );

  return nextArray;
};
