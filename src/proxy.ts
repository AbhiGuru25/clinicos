import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If session is expired, this will refresh it in the cookies
  // which is why we return the 'res' object

  // Protection logic:
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isAuth = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuth && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
