import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/doctor/dashboard') || pathname.startsWith('/doctor/consultation') || pathname.startsWith('/doctor/slots')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/doctor/dashboard/:path*', '/doctor/consultation/:path*', '/doctor/slots/:path*'],
}
