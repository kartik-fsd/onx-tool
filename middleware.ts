import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected
const protectedPaths = ['/add-seller', '/add-products']

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('user')

    if (
        protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) &&
        !currentUser
    ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/add-seller/:path*', '/add-products/:path*'],
}
