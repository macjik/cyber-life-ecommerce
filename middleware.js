import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('Executing middleware for:', req.nextUrl.pathname);

  const response = NextResponse.next();
  response.cookies.set('currentPath', req.nextUrl.pathname);

  let cookieHeader = req.headers.get('cookie');
  let cookies = parse(cookieHeader || '');
  console.log(cookies);
  let token = cookies.token;

  console.log('Token from cookie:', token);
  const paths = ['/auth'];

  if (!token) {
    if (!paths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL('/auth', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    console.log('Decoded token:', payload);

    if (paths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL(cookies.redirect || '/', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    const url = new URL(req.url);
    let userId = url.searchParams.get('id');
    console.log(payload.id);

    if (!userId) {
      url.searchParams.set('id', payload.id);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Token verification failed:', error);
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|equipment(?:/[^/]+)?|clothes(?:/[^/]+)?|electronics(?:/[^/]+)?|product(?:/[^/]+)?).*)',
  ],
};
