import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set up public routes
const publicPaths = ["/sign-in*", "/sign-up*"];

const isPublic = (path: string) => {
    return publicPaths.find((x) =>
        path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
    );
};

export default withClerkMiddleware((request: NextRequest) => {
    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    // If the user is not signed in and the path is not public, redirect them to sign in
    const { userId } = getAuth(request);
    if (!userId) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next
         * - static (static files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!static|.*\\..*|_next|favicon.ico).*)",
        "/",
    ],
};