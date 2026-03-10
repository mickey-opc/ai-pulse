import createMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Cookie name to use for locale
  localeCookieName: 'locale'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*']
};
