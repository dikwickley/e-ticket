import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import dbConnect from "../../../util/db";
import User from "../../../models/User.model";

export const authOptions = {
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // database look up

        await dbConnect();
        let user = await User.find({ username: credentials.username });

        console.log({ user });

        if (user.length == 0) return null;
        user = user[0];
        if (
          credentials.username === user.username &&
          credentials.password === user.password
        ) {
          return user;
        }

        // login failed
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id;
        token.user = user;
        token.user.access = user.access;
        token.user.username = user.username;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.user.access = token.user.access;
        session.user.username = token.user.username;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
