import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import connectDb from "./lib/db";
import User from "./models/user-model";

import bcrypt from "bcryptjs";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [

    // ================= GOOGLE PROVIDER =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ================= CREDENTIAL PROVIDER =================
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        await connectDb();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {

    // ================= SIGN IN CALLBACK =================
    async signIn({ user, account }) {

      // Only for Google Login
      if (account?.provider === "google") {

        await connectDb();

        const existingUser = await User.findOne({
          email: user.email,
        });

        // Create user if not exists
        if (!existingUser) {

          await User.create({
            name: user.name,
            email: user.email,

            // Google users don't need password
            password: "GOOGLE_AUTH",

            isEmailVerified: true,

            role: "user",
          });
        }
      }

      return true;
    },

    // ================= JWT CALLBACK =================
    async jwt({ token, user }) {

      await connectDb();

      // Find current DB user
      const dbUser = await User.findOne({
        email: token.email,
      });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }

      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // ================= SESSION CALLBACK =================
    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
});