import { createCookieSessionStorage } from "@remix-run/node";

const MAX_AGE = 60 * 60 * 8;

const {getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "sb:token",
        maxAge: 60 * 60 * 8,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        domain: '',
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: true,
        secrets: ['supabase is the dopest!']
    }
})

export { getSession, commitSession, destroySession }