import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const clientId = process.env.GITHUB_ID as string;
const clientSecret = process.env.GITHUB_SECRET as string;

export const authOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
      authorization: { params: { scope: "repo" } },
    }),
  ],
  stategy: "jwt",
  jwt: {
    secret: process.env.SECRET as string,
  },
  secret: process.env.SECRET as string,
  theme: {
    brandColor: "#ffffff",
    logo: "https://artux.net/images/play-button.png",
  },
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      console.log(
        "Имя пользователя:",
        session.user.name,
        "\nАватар:",
        session.user.image,
        "\nТокен:",
        session.accessToken
      );
      return session;
    },
  },
};

export default NextAuth(authOptions);
