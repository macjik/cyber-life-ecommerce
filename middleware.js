import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export async function middleware(req) {
  const response = NextResponse.next();

  // Set current path
  response.headers.set('x-current-path', req.nextUrl.pathname);

  // Locale detection logic
  function getLocale(request) {
    const negotiatorHeaders = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
    const locales = i18n.locales;
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
    return matchLocale(languages, locales, i18n.defaultLocale);
  }

  const locale = getLocale(req);
  response.headers.set('x-locale', locale);

  // Token and authentication logic
  const cookieHeader = req.headers.get('cookie');
  const cookies = parse(cookieHeader || '');
  const token = cookies.token;
  const paths = ['/auth'];
  const dynamicCategoryProductPattern = /^\/[^\/]+\/[^\/]+$/;
  const cartPathPattern = /^\/cart\/[^\/]+$/;

  // Skip routes logic
  if (
    dynamicCategoryProductPattern.test(req.nextUrl.pathname) &&
    !cartPathPattern.test(req.nextUrl.pathname)
  ) {
    return response;
  }

  if (!token) {
    if (!paths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL('/auth', req.url);
      req.nextUrl.searchParams.forEach((value, key) => redirectUrl.searchParams.set(key, value));
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    response.headers.set('x-user-role', payload.role || 'guest');

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (paths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL(cookies.redirect || '/', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    if (!userId || userId !== payload.id) {
      url.searchParams.delete('id');
      url.searchParams.set('id', payload.id);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Token verification failed:', error);
    const redirectUrl = new URL('/auth', req.url);
    const inviteParam = req.nextUrl.searchParams.get('invite');
    if (inviteParam) redirectUrl.searchParams.set('invite', inviteParam);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
