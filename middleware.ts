import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localeCookie: true
});

export const config = {
  matcher: ['/', '/(zh|en)/:path*']
};
