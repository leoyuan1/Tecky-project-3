import express from 'express'
import expressSession from 'express-session';
import grant from 'grant';
import { userRoutes } from './userRoutes';
import { app, PORT, server } from './util/connection-config';
import { UserController } from "./Controller/userController"
import { UserService } from "./Service/userService"
import { User } from './util/session';
import { knex } from './util/db';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const grantExpress = grant.express({
    defaults: {
        origin: `http://localhost:${PORT}`,
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
app.use(express.static('public'))

export const userService = new UserService(knex)
export const userController = new UserController(userService)

app.use('/', userRoutes)

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})