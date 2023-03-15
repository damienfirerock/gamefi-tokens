namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    // APPLE_ID: string;
    // APPLE_TEAM_ID: string;
    NEXT_PUBLIC_APPLE_CLIENT_ID: string;
    NEXT_PUBLIC_APPLE_CLIENT_SECRET: string;
    NEXT_PUBLIC_FACEBOOK_CLIENT_ID: string;
    NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
  }
}
