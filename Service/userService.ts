import { Knex } from "knex";


export class UserService {
    constructor(private knex: Knex) { }

    async getUserByEmail(userEmail: string) {
        let foundUser = (await this.knex.raw(`select * from users where email = ?`, [userEmail])).rows[0]
        return foundUser
    }

    async getUserByUserName(userUsername: string) {
        let foundUsername = (await this.knex.raw(`select * from users where username = ?`, [userUsername])).rows[0]
        return foundUsername
    }

    async insertUser(userEmail: string, hashedPassword: string, userName: string, fileName: string) {
        let user = (await this.knex.raw('INSERT INTO users (email,password,username,icon,created_at,updated_at) values (?,?,?,?,now(),now()) returning *',
            [userEmail,
                hashedPassword,
                userName,
                fileName
            ]
        )).rows[0]
        return user
    }
    async changePassword(userEmail: string, hashedPassword: string) {
        await this.knex.raw(`UPDATE users SET password = ?, updated_at = now() WHERE email = ?`, [hashedPassword, userEmail])
    }
}

