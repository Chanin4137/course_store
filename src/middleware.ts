import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, JWTPayload } from 'jose'

interface Payload extends JWTPayload {
    id: string

}

const decryptJwtToken = async (token: string): Promise<Payload | null> => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as Payload
    } catch (error) {
        console.error('Error descripting jwt token:', error)
        return null
    }
}

export const middleware = async (req: NextRequest) => {
    const token = req.cookies.get('token')?.value // get token from cookie
    const response = NextResponse.next()
    if (!token) {
        return response // if no token,can continue 
    }

    const payload = await decryptJwtToken(token)
    const isTokenExpired = payload?.exp && payload.exp < Date.now() / 1000

    if (!payload || isTokenExpired) {
        response.cookies.delete('token') // delete token if expired
        return response // if token expired,can continue
    }

    response.headers.set('x-user-id', payload.id) // set user id to header
    return response
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*', //check all deep after auth
        '/admin/:path*', //check all deep after admin
        '/cart',
        '/checkout/:path*', //check all deep after checkout
    ]
}
