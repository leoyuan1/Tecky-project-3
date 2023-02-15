import { Knex } from "knex";
import { userFormidablePromise } from "../util/formidable";
import express from "express"

export class UserService {
    constructor(private knex: Knex) { }

    async getUserByEmail(userEmail: string) {
        let foundUser = (await this.knex.raw(`select * from users where email = $1`, [userEmail])).rows[0]
        return foundUser
    }

    async getUserByUserName(userUsername: string) {
        let foundUsername = (await this.knex.raw(`select * from users where username = $1`, [userUsername])).rows[0]
        return foundUsername
    }

    async insertUser(userEmail: string, userUsername: string, fileName: string, hashedPassword: string) {
        let user = (await this.knex.raw('INSERT INTO users (email,password,icon,username,created_at,updated_at) values ($1,$2,$3,$4,now(),now()) returning *',
            [userEmail,
                hashedPassword,
                fileName,
                userUsername
            ]
        )).rows[0]
        return user
    }
}

