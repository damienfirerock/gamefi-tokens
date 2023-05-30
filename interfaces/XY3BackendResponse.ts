export const PLATFORM_ROUTE = "/auth/platform";

export interface XY3BackendError {
  code?: number;
  reason?: string;
  message?: string;
  metadata: any;
}

export interface XY3BackendLoginSuccess {
  unionid: string;
  accesstoken: string;
  refreshtoken: string;
  logintype: string;
}

export type XY3BackendResponse = XY3BackendError | XY3BackendLoginSuccess;
