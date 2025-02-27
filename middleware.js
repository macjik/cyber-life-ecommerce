import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const response = NextResponse.next();

  response.headers.set('x-current-path', req.nextUrl.pathname);

  let cookieHeader = req.headers.get('cookie');
  let cookies = parse(cookieHeader || '');
  let token = cookies.token;

  const paths = ['/auth', '/reset-password'];
  const dynamicCategoryProductPattern = /^\/[^\/]+\/[^\/]+$/;
  const cartPathPattern = /^\/cart\/[^\/]+$/;
  const lifePathPattern = /^\/life(?:\/.*)?$/;

  const getLocale = (language) => {
    if (language === 'ru') return 'ru';
    if (language === 'uz') return 'uz';
    if (language === 'en') return 'en';
    if (language === 'zh' || language === 'zh-CN') return 'zh';
    if (language === 'zh-TW') return 'zh';
    if (language === 'zh-HK') return 'zh';
    return 'ru';
  };

  if (!cookies.locale) {
    const acceptLanguage = req.headers.get('accept-language') || '';
    const primaryLanguage = acceptLanguage.replace(/^([a-z]{2}).*$/i, '$1');
    const preferredLocale = getLocale(primaryLanguage);
    response.cookies.set('locale', preferredLocale, { path: '/' });
  }

  if (req.nextUrl.pathname === '/') {
    return response;
  }

  if (lifePathPattern.test(req.nextUrl.pathname)) {
    const locale = cookies.locale || getLocale(req.headers.get('accept-language'));
    if (locale !== 'zh') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (
    dynamicCategoryProductPattern.test(req.nextUrl.pathname) &&
    !cartPathPattern.test(req.nextUrl.pathname) &&
    !lifePathPattern.test(req.nextUrl.pathname)
  ) {
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

    response.headers.set('x-user-role', payload.role || 'guest');

    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (paths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL(cookies.redirect || '/', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    const url = new URL(req.url);
    let userId = url.searchParams.get('id');

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
