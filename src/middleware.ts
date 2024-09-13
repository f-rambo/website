export { auth as middleware } from "@/auth"

// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from "@/auth";
// import { Session } from "next-auth";

// export default async function Middleware(request: NextRequest) {
//     const session = await auth() as Session;
//     console.log(session);
//     if (!session || !session.user || !session.user.email) {
//         return NextResponse.redirect(new URL('/home', request.url));
//     }
//     if (session.expires && new Date(session.expires) < new Date()) {
//         return NextResponse.redirect(new URL('/home', request.url));
//     }
//     return NextResponse.next();
// }

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth|themes|layout|demo).*)',
    ],
};
