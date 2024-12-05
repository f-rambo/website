import NextAuth,{ CredentialsSignin } from "next-auth"
import GitHub from "next-auth/providers/github"
import { User } from "@auth/core/types"
import Credentials from "next-auth/providers/credentials"
import { User as adminUser } from "@/types/types"
import md5 from "md5";

const userApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}/user/`;

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

const signInFunction = async (email: string, password: string, access_token: string) => {
  let signinRequest = {
    email: email,
    password: password,
    access_token: access_token,
  };
  const res = await fetch(userApi + "signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(signinRequest),
  });
  const data = await res.json() as adminUser;
  if (!data || !data.access_token){
    return null
  }
  return data
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: { logo: "/favicon.ico",colorScheme: "auto" },
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type:"email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) : Promise<User> {
        return {email: credentials.email as string, id: md5(credentials.password as string)}
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        const data  = await signInFunction(
          user.email as string, 
          user.id as string, // as password
          account.access_token as string, 
        )
        if (data) {
            token.id = data.id;
            token.accessToken = data.access_token;
            token.status = data.status_string;
        }else {
          throw new InvalidLoginError()
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.userId = token.id as string;
      }
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token?.provider) {
        session.provider = token.provider as string;
      }
      if (token?.status) {
        session.status = token.status as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    userId?: string
    user?: User
    expires?: string // 2024-06-12T13:47:56.390Z
    provider?: string
    status?: string
  }
}
