import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    return res
}

export const config = {
    matcher: "/((?!login|_next/static|signup|_next/image).*)"
}