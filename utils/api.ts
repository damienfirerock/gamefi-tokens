import {
  XY3BackendResponse,
  XY3BackendError,
} from "../interfaces/XY3BackendResponse";

export const makeFetchRequestToXY3Backend = async (url: string, body: any) => {
  try {
    const request = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const response: XY3BackendResponse = await request.json();

    if ("code" in response) {
      // response is of type XY3BackendError
      if (response?.code === 500) {
        // Right now checking for 500 only,
        // but we can always add checks in the future,
        // or assume that any response with 'code' is an error response
        throw response;
      }
    }

    // Due to how this is a common helper,
    // return general response and let respective endpoints handle the data
    return { status: 200, result: { success: true, data: response } };
  } catch (error: XY3BackendError | any) {
    return {
      status: error.code || 500,
      result: {
        success: false,
        error: error.message || error.message || "Request Failed",
      },
    };
  }
};
