import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

const NEXT_PUBLIC_LOCAL_BACKEND = process.env.NEXT_PUBLIC_LOCAL_BACKEND;

import {
  PROXY_AUTH_ENDPOINT,
  EMAIL_LOGIN_PATH,
} from "../../../features/AuthSlice";
import {
  XY3BackendResponse,
  XY3BackendLoginSuccess,
} from "../../../interfaces/XY3BackendResponse";
import { JWT } from "next-auth/jwt";

const isXY3BackendLoginSuccess = (
  data: XY3BackendResponse
): data is XY3BackendLoginSuccess => {
  return (
    (data as XY3BackendLoginSuccess).unionid !== undefined &&
    (data as XY3BackendLoginSuccess).accesstoken !== undefined &&
    (data as XY3BackendLoginSuccess).refreshtoken !== undefined &&
    (data as XY3BackendLoginSuccess).logintype !== undefined
  );
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_APPLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials!;

        const body = JSON.stringify({ email, password });

        const response: {
          success: boolean;
          data: XY3BackendResponse;
          error?: undefined;
        } = await fetch(
          `${NEXT_PUBLIC_LOCAL_BACKEND}${PROXY_AUTH_ENDPOINT}${EMAIL_LOGIN_PATH}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body,
          }
        ).then((res) => res.json());

        const { data } = response;

        if (response.error || !isXY3BackendLoginSuccess(data)) return null;

        const user = {
          id: data.unionid,
          email: email,
          accessToken: data.accesstoken,
          refreshToken: data.refreshtoken,
          loginType: data.logintype,
        };

        return Promise.resolve(user);
      },
    }),
  ],
  debug: true,
  // https://github.com/nextauthjs/next-auth/discussions/6898
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  pages: {
    signOut: "/", // Prevents redirect to next-auth signout confirmation page
  },
  callbacks: {
    async jwt(props: any) {
      const { token, user, account } = props;

      // Credentials Login
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.loginType = user.loginType;
      }

      // Social Login
      if (account) {
        token.accessToken = account.accessToken;
        token.provider = account.provider;
      }
      return token;
    },

    async session(props: { session: any; token: JWT }) {
      const { session, token } = props;
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      if (token?.provider) {
        session.provider = token.provider;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);

// https://next-auth.js.org/configuration/options
// No need to store access tokens, can getToken from local backend
// Can only be properly tested with getUnionAccount endpoint

// import { getToken } from "next-auth/jwt"

// const secret = process.env.NEXTAUTH_SECRET

// export default async function handler(req, res) {
//   // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
//   // const token = await getToken({ req })
//   const token = await getToken({ req, secret })
//   console.log("JSON Web Token", token)
//   res.end()
// }
