import express from 'express'
import expressSession from 'express-session';
import grant from 'grant';
import { userRoutes } from './userRoutes';
import { app, PORT, server } from './util/connection-config';

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
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
})

app.use(sessionMiddleware)
app.use(express.static('public'))
app.use('/', userRoutes)





server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})