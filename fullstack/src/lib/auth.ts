import NextAuth, { Session, User } from "next-auth"
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth }= NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {},
        password: {}
      },
      authorize: async (credentials, req) => {
        console.log(credentials, req.url)
        const user = {
          id: '10000',
          name: 'test',
          email: 'test@test.com',
          power: 1
        }
        if (!user) return null
        return  user
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks:{
    session: async (params:{ session: Session, token: JWT }): Promise<Session> => {
      if (params.token.user) {
        params.session.user = params.token.user;
      }
      console.log('async', params.session, params.token)
      return params.session;
    },
    jwt: async (params: { token: JWT, user: User }): Promise<JWT> => {
      if (params.user) {
        params.token.user = params.user;
      }
      console.log('async', params.token)
      return params.token;
    },
  },
  pages: {
    signIn: "/login",
  },
})
