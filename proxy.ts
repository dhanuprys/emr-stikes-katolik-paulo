import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

const publicRoutes = ['/login'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/upload') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  const isPublicRoute = publicRoutes.includes(pathname);

  // Parse session if exists
  let isAuthenticated = false;
  if (sessionCookie) {
    const payload = await decrypt(sessionCookie);
    if (payload && payload.userId) {
      isAuthenticated = true;
    }
  }

  // Redirect to login if unauthenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
