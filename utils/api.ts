import { XY3BackendResponse } from "../interfaces/XY3BackendResponse";

export const makeFetchRequestToXY3Backend = async (url: string, body: any) => {
  try {
    const request = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const response: XY3BackendResponse = await request.json();

    if (response?.code === 500)
      throw Error(response.reason || response.message);

    return { status: 200, result: { success: true } };
  } catch (error: any) {
    return {
      status: 500,
      result: {
        success: false,
        error: error.message || "Request Failed",
      },
    };
  }
};
