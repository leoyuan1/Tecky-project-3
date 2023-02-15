
import express from "express"
import { UserService } from "../Service/userService"
import { hashPassword } from "../util/bcrypt"
import { userFormidablePromise } from "../util/formidable"
import { logger } from "../util/logger"


export class UserController {
    constructor(private userService: UserService) { }

    isUser = async (req: express.Request, res: express.Response) => {
        if (!req.session.user) {
            res.json({
                message: 'no session data',
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
        // let { fields, files } = await userFormidablePromise(req)
        // let selectUserResult = await .query(`select * from users where email = $1`, [fields.email])
        // let foundUser = selectUserResult.rows[0]
        try {
            let { fields, files } = await userFormidablePromise(req)
            if (!files || !fields) {
                res.status(402).json({
                    message: 'Invalid username'
                })
                return
            }
            let userEmail: string = files.email
            let userUsername: string = files.username
            let foundUser = await this.userService.getUserByEmail(userEmail)
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
            let user = await this.userService.insertUser(userEmail, userUsername, fileName, hashedPassword)
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
}