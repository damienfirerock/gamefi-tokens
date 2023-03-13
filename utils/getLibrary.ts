import { Web3Provider } from "@ethersproject/providers";

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  console.log({ library });

  console.log({ libraryProvider: library.provider });
  library.pollingInterval = 15000;
  return library;
}
