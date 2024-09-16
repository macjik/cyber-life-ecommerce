'use server';

import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('Executing middleware for:', req.nextUrl.pathname);

  let cookieHeader = req.headers.get('cookie');
  let cookies = parse(cookieHeader || '');
  console.log(cookies);
  let token = cookies.token;

  console.log('Token from cookie:', token);
  const paths = ['/auth'];

  if (!token) {
    if (!paths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/'));
    }

    console.log('Decoded token:', payload);

    // await client.set(payload.id, JSON.stringify(payload), "EX", 3600);

    req.user = payload;

    // let response = NextResponse.next();
    // response.cookies.set("id", payload.id);
    // console.log(response)

    if (paths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
    // return response;
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/auth', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
