// Ref: https://github.com/dethcrypto/dethtools

import { Fragment, Interface, ParamType } from "@ethersproject/abi";
import { z } from "zod";
import assert from "assert";

const MAX_RETRY = 30;

// Site went down
// May want to consider going to the source: https://github.com/ethereum-lists/4bytes
// @internal
function urlTo(hexSigType: HexSigType): string {
  return `https://www.4byte.directory/api/v1/${hexSigType}/?hex_signature=`;
}

export function parseAbi(
  rawAbi: string,
  defaultKeyword: string = "function"
): Interface | Error {
  const formated: string[] = [];

  // check for JSON format
  try {
    return new Interface(rawAbi);
  } catch (e) {
    if (!(e instanceof Error && e.message.startsWith("Unexpected token"))) {
      return e as Error;
    }
  }

  const parsed = rawAbi
    .split("',")
    .map((line) =>
      line
        .trim()
        .split("")
        .filter((char) => char !== "'")
        .join("")
    )
    .filter((line) => line);

  for (const frag of parsed) {
    if (!findKeyword(frag)) {
      // if the fragment contains indexed, it's a event
      if (frag.includes("indexed")) {
        formated.push(`event ${frag}`);
      } else {
        formated.push(`${defaultKeyword} ${frag}`);
      }
    } else {
      formated.push(frag);
    }
  }

  return new Interface(formated);
}

const keywords = [
  "function",
  "modifier",
  "event",
  "error",
  "constructor",
  "fallback",
  "receive",
];

// @internal
export function findKeyword(frag: string): boolean {
  frag = frag.trim();

  let word = "";
  const match = new RegExp(/[a-zA-Z]/);

  for (const letter of frag.split("")) {
    if (!match.test(letter)) break;
    else word += letter;
  }

  for (const keyword of keywords) {
    if (keyword === word) return true;
  }
  return false;
}

async function safeFetch<T>(...args: Parameters<typeof fetch>): Promise<T> {
  return fetch(...args).then(async (response) => {
    if (response.status === 200) {
      return response.json() as unknown as T;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  });
}

interface FourBytesReponseEntry {
  id: number;
  text_signature: string;
  bytes_signature: string;
  created_at: string;
  hex_signature: string;
}
// @internal
// there are more types, but we don't need them for now
export type HexSigType = "signatures" | "event-signatures";

type Bytes4Cache = {
  [sigType in HexSigType]: {
    // undefined - not populated
    // [] - no results
    // [...] - results
    [sig: string]: FourBytesReponseEntry[] | undefined;
  };
};

// @internal
const bytes4Cache: Bytes4Cache = {
  signatures: {},
  "event-signatures": {},
};

// @internal
interface FourBytesReponseEntry {
  id: number;
  text_signature: string;
  bytes_signature: string;
  created_at: string;
  hex_signature: string;
}

// @internal
interface FourBytesResponse {
  count: number;
  next: unknown;
  previous: unknown;
  results: FourBytesReponseEntry[];
}

async function fetch4Bytes(
  hexSig: string,
  hexSigType: HexSigType,
  retries: number = 0
): Promise<FourBytesReponseEntry[] | undefined> {
  let result: FourBytesReponseEntry[] | undefined;
  const cached = bytes4Cache[hexSigType][hexSig];
  if (cached) {
    return cached;
  }
  try {
    const { results } = await safeFetch<FourBytesResponse>(
      `${urlTo(hexSigType)}${hexSig}`
    );
    bytes4Cache[hexSigType][hexSig] = results;
    result = results;
  } catch (error) {
    retries += 1;
    if (retries < MAX_RETRY) {
      return fetch4Bytes(hexSig, hexSigType, retries);
    } else {
      return undefined;
    }
  }
  return result;
}

export const fetch4BytesBy = {
  EventSignatures: async (sigHash: string) => {
    return fetch4Bytes(sigHash, "event-signatures");
  },
  Signatures: async (sigHash: string) => {
    return fetch4Bytes(sigHash, "signatures");
  },
};

// @internal
export function parse4BytesResToIfaces(
  data: FourBytesReponseEntry[],
  defaultKeyword: string = "function"
): Interface[] {
  const ifaces: Interface[] = [];
  for (const result of data) {
    const frag = result.text_signature;
    let parsed: Interface | Error;
    try {
      parsed = parseAbi(frag, defaultKeyword);
      if (parsed instanceof Interface) ifaces.push(parsed);
    } catch (e) {}
  }
  return ifaces;
}

export function decodeCalldata(
  iface: Interface,
  calldata: string
): DecodeResult | undefined {
  const abi = iface.fragments;

  let decoded: ReadonlyArray<unknown> | undefined;
  let fragment: Fragment | undefined;

  for (const frag of abi) {
    try {
      decoded = iface.decodeFunctionData(frag.name, calldata);
      const encoded = iface.encodeFunctionData(frag.name, decoded);
      assert(
        encoded === calldata,
        "Ignore functions that do not fully encode data"
      );
      fragment = frag;
    } catch (e) {
      // catch error here to avoid error throw,
      // as we want to check which fragment decodes successfully and save it
    }
  }

  if (decoded && fragment) {
    return { decoded, fragment, sigHash: iface.getSighash(fragment) };
  }
}

// @internal
export function decode4BytesData<T extends unknown, R>(
  ifaces: Interface[],
  data: T,
  decodeFn: (iface: Interface, data: T) => R | undefined
): R[] {
  const decoded: R[] = [];
  for (const iface of ifaces) {
    const decodeResult = decodeFn(iface, data);
    if (decodeResult) decoded.push(decodeResult);
  }
  return decoded;
}

// @internal
export function decodeByCalldata(
  ifaces: Interface[],
  calldata: string
): DecodeResult[] {
  return decode4BytesData(ifaces, calldata, decodeCalldata);
}

export interface DecodeResult {
  decoded: Decoded;
  fragment: Fragment;
  sigHash: string;
}

export interface Decoded extends ReadonlyArray<unknown> {}

export async function decodeWithCalldata(
  sigHash: string,
  calldata: string
): Promise<DecodeResult[] | undefined> {
  const response = await fetch4BytesBy.Signatures(sigHash);
  if (response) {
    const ifaces = parse4BytesResToIfaces(response);
    const decodedByCalldata = decodeByCalldata(ifaces, calldata);
    if (decodedByCalldata.length === 0 && ifaces.length > 0) {
      return [{ decoded: [], fragment: ifaces[0].fragments[0], sigHash }];
    } else {
      return decodedByCalldata;
    }
  }
}

export const hexSchema = z
  .string()
  .regex(/^0[xX][0-9a-fA-F]+$/, {
    message: "The value must be a hexadecimal number, 0x-prefix is required",
  })
  .min(2, { message: "The value must be longer than 2 digit" });

export function sigHashFromCalldata(calldata: string): string | undefined {
  const chunk = calldata.slice(0, 10);
  if (hexSchema.safeParse(chunk).success) {
    return chunk;
  }
}

export interface DecodedData {
  fnName: string;
  fnType: string;
  decoded: Decoded;
  inputs: ParamType[];
}

// MAIN FUNCTION
export async function handleDecodeCalldataWith4Bytes(
  encodedCalldata: string
): Promise<DecodedData[] | undefined> {
  try {
    const signatureHash = sigHashFromCalldata(encodedCalldata);
    const decodeResults = await decodeWithCalldata(
      signatureHash!,
      encodedCalldata
    );
    if (!decodeResults) throw new Error("Signature is wrong or undefined");
    else {
      const mappedResults = decodeResults.map((decoded) => {
        return {
          fnName: decoded.fragment.name,
          fnType: decoded.fragment.type,
          decoded: decoded.decoded,
          inputs: decoded.fragment.inputs,
        };
      });
      return mappedResults;
    }
  } catch (error) {
    throw new Error("Unable to Decode Calldata");
  }
}
