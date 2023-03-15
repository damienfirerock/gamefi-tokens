import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    // Need to be enrolled in the Apple Developer Program, which costs money
    // AppleProvider({
    //   clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_APPLE_CLIENT_SECRET,
    // }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
