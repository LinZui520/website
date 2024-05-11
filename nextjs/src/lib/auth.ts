import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {}, password: {}
      },
      authorize: async (credentials, _req) => {
        if (!credentials.username || !credentials.password) return null
        const username = String(credentials.username)
        const password = String(credentials.password)
        const user = await prisma.user.findFirst({
          where: { username }
        })
        if (!user || !bcrypt.compareSync(password, user.password)) return null
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          image: process.env.URL + "/image/" + user.avatar
        }
      }
    })
  ],
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt: async (params: { token: JWT, user: User }): Promise<JWT> => {
      if (params.user) {
        params.token.user = params.user
      }
      return params.token
    },
    session: async (params:{ session: Session, token: JWT }): Promise<Session> => {
      if (params.token.user) {
        params.session.user = params.token.user
      }
      return params.session
    }
  }
})
