import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth }= NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"}
      },
      authorize: async (credentials, req) => {
        console.log(credentials, req.body)
        return  {
          id: '100000',
          username: credentials.username,
          password: credentials.password,
          power: 3,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks:{

  },
  pages: {
    signIn: "/login",
  },
})
