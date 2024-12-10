import { auth } from "@/auth"
import {Session } from "next-auth"

export const dynamic = 'force-dynamic'

const backendUrl = `${process.env.NEXT_PUBLIC_API ?? ""}${
       process.env.NEXT_PUBLIC_API_VERSION ?? ""
     }`;

export async function GET(request: Request) {
   const session = await auth() as Session;
   
   const url = new URL(request.url);
   
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const serachParanms = new URLSearchParams(url.searchParams).toString();
   const newHeaders = new Headers(request.headers); 
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl+(serachParanms ? '?' + serachParanms : ''), {
     method: 'GET',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function POST(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const newHeaders = new Headers(request.headers); 
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);


   const forwardedResponse = await fetch(newUrl, {
     method: 'POST',
     headers: newHeaders,
     body: await request.clone().text(),
   });


   return forwardedResponse;
}

export async function PUT(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const newHeaders = new Headers(request.headers); 
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'PUT',
     headers: newHeaders,
     body: await request.clone().text(),
   });


   return forwardedResponse;
}

export async function DELETE(request: Request) { 
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const newHeaders = new Headers(request.headers);
   // 将原始请求的查询参数附加到新的URL上
   const serachParanms = new URLSearchParams(url.searchParams).toString();
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl +(serachParanms ? '?' + serachParanms : ''), {
     method: 'DELETE',
     headers: newHeaders,
   });

   return forwardedResponse;
}


export async function PATCH(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ;
   const newHeaders = new Headers(request.headers);
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl, {
     method: 'PATCH',
     headers: newHeaders,
     body: await request.clone().text(),
   });

   return forwardedResponse;
}

export async function OPTIONS(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const newHeaders = new Headers(request.headers); 
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'OPTIONS',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function HEAD(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ; 
   const newHeaders = new Headers(request.headers); 
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl, {
     method: 'HEAD',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function TRACE(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ;
   const newHeaders = new Headers(request.headers);
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl, {
     method: 'TRACE',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function CONNECT(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');

   const newUrl = backendUrl+url.pathname ;
   const newHeaders = new Headers(request.headers);
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   const forwardedResponse = await fetch(newUrl, {
     method: 'CONNECT',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function PROPFIND(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   // Build new request
   const newUrl = backendUrl+url.pathname ; // New address
   const newHeaders = new Headers(request.headers); // copy original request headers
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   // send forwarded request
   const forwardedResponse = await fetch(newUrl, {
     method: 'PROPFIND',
     headers: newHeaders,
   });

   return forwardedResponse;
}

export async function PROPPATCH(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   const newUrl = backendUrl+url.pathname ;
   const newHeaders = new Headers(request.headers);
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);
   newHeaders.append('User-Id', session?.userId as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'PROPPATCH',
     headers: newHeaders,
   });

   return forwardedResponse;

}

