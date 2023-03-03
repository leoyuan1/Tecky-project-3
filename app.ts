import express from 'express'
import expressSession from 'express-session';
import grant from 'grant';
import { app, PORT, server } from './util/connection-config';
import { User } from './util/session';
import { userRoutes } from './userRoutes';
import { songRoutes } from './songRoutes';
import { gameplayRoutes } from './gameplayRoutes';
import { isLoggedIn } from './util/guard';
import dotenv from 'dotenv'

dotenv.config()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const grantExpress = grant.express({
    defaults: {
        origin: `https//dancewarrior.me`,
        transport: "session",
        state: true,
    },
    google: {
        key: process.env.GOOGLE_CLIENT_ID || "",
        secret: process.env.GOOGLE_CLIENT_SECRET || "",
        scope: ["profile", "email"],
        callback: "/login/google",
    },
});

const sessionMiddleware = expressSession({
    secret: "New Project",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
})

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}

app.use(sessionMiddleware)
app.use(grantExpress as express.RequestHandler)
app.use(express.static('public'))


app.use('/', userRoutes)
app.use('/', songRoutes)
app.use('/', gameplayRoutes)
app.use(isLoggedIn, express.static('protect'))

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})