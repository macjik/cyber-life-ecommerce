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

  const dynamicCategoryProductPattern = /^\/[^\/]+\/[^\/]+$/; 
  const cartPathPattern = /^\/cart\/[^\/]+$/; 

  if (
    dynamicCategoryProductPattern.test(req.nextUrl.pathname) &&
    !cartPathPattern.test(req.nextUrl.pathname)
  ) {
    console.log('Skipping middleware for dynamic category/product path:', req.nextUrl.pathname);
    return response; 
  }

 if (!token) {
   if (!paths.includes(req.nextUrl.pathname)) {
     const redirectUrl = new URL('/auth', req.url);

     req.nextUrl.searchParams.forEach((value, key) => {
       redirectUrl.searchParams.set(key, value);
     });

     redirectUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
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

    const inviteParam = req.nextUrl.searchParams.get('invite');
    if (inviteParam) {
      redirectUrl.searchParams.set('invite', inviteParam);
    }

    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
