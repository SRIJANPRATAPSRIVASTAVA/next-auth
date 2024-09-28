// /https:/ / authjs.dev / guides / edge - compatibility#middleware

import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    console.log("ROUTE", req.nextUrl.pathname);
    console.log(isLoggedIn);
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