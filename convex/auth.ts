import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    {
      id: 'djo',
      name: 'DJO Amersfoort',
      type: 'oidc',
      issuer: 'https://leden.djoamersfoort.nl/o',
      clientId: process.env.AUTH_DJO_ID,
      clientSecret: process.env.AUTH_DJO_SECRET,
      authorization: {
        params: { scope: 'openid user/basic user/names user/email' }
      }
    }
  ],
});
