const { NextResponse } = require('next/server');
const { NextRequest } = require('next/server');

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Log the current pathname and any search parameters
  console.log('Request Path:', url.pathname);
  console.log('Current Query Parameters:', url.searchParams.toString());

  if (url.pathname === '/' && !url.searchParams.has('modal')) {
    console.log('Adding modal=true to the URL');
    url.searchParams.set('modal', 'true');
    return NextResponse.redirect(url);
  }

  console.log('No redirection needed');
  return NextResponse.next();
}
