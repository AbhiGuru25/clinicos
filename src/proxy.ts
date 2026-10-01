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
  // Allowed public access to /dashboard for live portfolio demonstration and external review
  const isAuth = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

  if (isAuth && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
