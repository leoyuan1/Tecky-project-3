import express from "express"
import { UserService } from "../Service/userService"
import { checkPassword, hashPassword } from "../util/bcrypt"
import { userFormidablePromise } from "../util/formidable"
import { logger } from "../util/logger"
import crypto from "crypto"
import { User } from "../util/session"

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}
export class UserController {
    constructor(private userService: UserService) { }

    isUser = async (req: express.Request, res: express.Response) => {
        if (!req.session.user) {
            res.json({
                message: 'no session data'
            })
            return
        }
        res.json({
            message: 'isUser',
            user: req.session.user
        })
    }

    getUserID = async (req: express.Request, res: express.Response) => {
        if (!req.session.user) {
            res.json({
                message: 'no session data',
            })
            return
        }
        const userID = req.session.user['id'];
        res.json({ data: userID })
    }
    signup = async (req: express.Request, res: express.Response) => {
        try {
            let { fields, files } = await userFormidablePromise(req)
            if (!files || !fields) {
                res.status(402).json({
                    message: 'Invalid username'
                })
                return
            }
            let userEmail: string = fields.email
            let userUsername: string = fields.username
            let foundUser = (await this.userService.getUserByEmail(userEmail))
            if (foundUser) {
                res.json({
                    message: "email registered"
                })
                return
            }
            let foundUsername = await this.userService.getUserByUserName(userUsername)
            if (foundUsername) {
                res.json({
                    message: "username registered"
                })
                return
            }

            let fileName = files.image ? files.image['newFilename'] : ''

            let hashedPassword = await hashPassword(fields.password)
            let user = await this.userService.insertUser(userEmail, hashedPassword, userUsername, fileName)
            delete user.password
            req.session.user = user
            res.json({
                message: "OK"
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[USR001] - Server error'
            })
        }

    }
    login = async (req: express.Request, res: express.Response) => {
        try {
            let { userEmail, password } = req.body
            let foundUser = await this.userService.getUserByEmail(userEmail)
            if (!foundUser) {
                res.json({
                    message: "email not register"
                })
                return
            }
            let dataPassword = foundUser.password
            let isPasswordValid = await checkPassword(password, dataPassword)
            if (!isPasswordValid) {
                res.json({
                    message: 'Invalid password'
                })
                return
            }
            delete foundUser.password
            req.session.user = foundUser
            res.json({
                message: "correct"
            })

        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[USR001] - Server error'
            })
        }
    }
    loginGoogle = async (req: express.Request, res: express.Response) => {
        const accessToken = req.session?.['grant'].response.access_token;
        const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: "get",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        let result = await fetchRes.json();
        console.log(result);
        let userEmail = result.email
        let hashedPassword = await hashPassword(crypto.randomUUID())
        let userName = result.name
        let fileName = result.picture
        const foundUser = await this.userService.getUserByEmail(userEmail)
        req.session.user = foundUser
        if (!foundUser) {
            // Create the user when the user does not exist
            let user = await this.userService.insertUser(userEmail, hashedPassword, userName, fileName)
            delete user.password
            req.session.user = user
        }
        res.redirect('/')
    }
    logout = async (req: express.Request, res: express.Response) => {
        if (!req.session.user) {
            res.status(403).json({
                message: 'Not authorized'
            })
            return
        }
        delete req.session.user
        res.json({
            message: 'logout'
        })
    }
    changePassword = async (req: express.Request, res: express.Response) => {
        let { existPassword, newPasswordValue } = req.body
        let hashedPassword = await hashPassword(newPasswordValue)
        if (!req.session.user) {
            res.status(403).json({
                message: 'Not authorized'
            })
            return
        }
        let session = req.session.user
        let userEmail = session.email
        let foundUser = await this.userService.getUserByEmail(userEmail)

        let isPasswordValid = await checkPassword(existPassword, foundUser.password)
        if (!isPasswordValid) {
            res.status(404).json({
                message: 'Invalid password'
            })
            return
        }
        await this.userService.changePassword(userEmail, hashedPassword)
        res.json({
            message: "Updated Password"
        })
    }
}