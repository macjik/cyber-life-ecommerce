import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('Executing middleware for:', req.nextUrl.pathname);

  const response = NextResponse.next();

  // Set the current path in the headers
  response.headers.set('x-current-path', req.nextUrl.pathname);

  let cookieHeader = req.headers.get('cookie');
  let cookies = parse(cookieHeader || '');
  console.log(cookies);
  let token = cookies.token;

  console.log('Token from cookie:', token);

  const paths = ['/auth'];

  const dynamicCategoryProductPattern = /^\/[^\/]+\/[^\/]+$/;
  const cartPathPattern = /^\/cart\/[^\/]+$/;

  // Skip certain routes
  if (
    dynamicCategoryProductPattern.test(req.nextUrl.pathname) &&
    !cartPathPattern.test(req.nextUrl.pathname)
  ) {
    console.log('Skipping middleware for dynamic category/product path:', req.nextUrl.pathname);
    return response;
  }

  // If no token is found, redirect to the auth page
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

  // Verify the token and extract the payload
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Set user role in headers
    response.headers.set('x-user-role', payload.role || 'guest');

    // Redirect if the user is not an admin on the admin path
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
    console.log('Existing userId in URL:', userId);

    // Ensure userId in URL matches the payload id
    if (!userId || userId !== payload.id) {
      url.searchParams.delete('id');
      url.searchParams.set('id', payload.id);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Token verification failed:', error);
    const redirectUrl = new URL('/auth', req.url);

    // Preserve invite parameter if present
    const inviteParam = req.nextUrl.searchParams.get('invite');
    if (inviteParam) {
      redirectUrl.searchParams.set('invite', inviteParam);
    }

    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
