// /https:/ / authjs.dev / guides / edge - compatibility#middleware

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    // const isLoggedIn = !!req.auth
    // console.log("ROUTE", req.nextUrl.pathname);
    // console.log(isLoggedIn);

    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl))
    }

    return null;
})

// Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: ["/auth/login"],
// }

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        '/((?!.+\\.[\\w]+$|_next).*)',
        '/'
    ],
}