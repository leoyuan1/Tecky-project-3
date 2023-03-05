import grant from 'grant'
import expressSession from 'express-session'

export const grantExpress = grant.express({
	defaults: {
		origin: 'https://dancewarrior.me',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID,
		secret: process.env.GOOGLE_SECRET,
		scope: ['profile', 'email'],
		callback: '/login/google'
	}
})

export const expressSessionConfig = expressSession({
	secret: 'Tecky Academy teaches typescript',
	resave: true,
	saveUninitialized: true
})
