import NextAuth,{ CredentialsSignin } from "next-auth"
import GitHub from "next-auth/providers/github"
import { User } from "@auth/core/types"
import Credentials from "next-auth/providers/credentials"
import { User as adminUser } from "@/types/types"
import md5 from "md5";
import { cookies } from 'next/headers'

const userApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}/user/`;

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

const setCookie = (key: string, val: string, expires: number) => {
  const cookieStore = cookies()
  cookieStore.set(key, val, {
    path: "/",
    expires: new Date(expires * 1000),
  })
}

const signInFunction = async (email: string, password: string, access_token: string, sign_type: string, username: string) => {
  let signinRequest = {
    email: email,
    password: password,
    access_token: access_token,
    sign_type: sign_type,
    username: username,
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
          account.provider as string, 
          user.name as string,
        )
        if (data) {
            token.id = data.id;
            token.accessToken = data.access_token;
            token.state = data.state;
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
      if (token?.state) {
        session.state = token.state as string;
      }
      return session;
    },
  },
  // debug: process.env.NODE_ENV !== "production" ? true : false,
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    userId?: string
    user?: User
    expires?: string // 2024-06-12T13:47:56.390Z
    provider?: string
    state?: string
  }
}
