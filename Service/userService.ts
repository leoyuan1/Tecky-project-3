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

    async insertUser(userEmail: string, userUsername: string, fileName: string, hashedPassword: string) {
        let user = (await this.knex.raw('INSERT INTO users (email,password,icon,username,created_at,updated_at) values (?,?,?,?,now(),now()) returning *',
            [userEmail,
                hashedPassword,
                fileName,
                userUsername
            ]
        )).rows[0]
        return user
    }
    async changePassword(userEmail: string, hashedPassword: string) {
        await this.knex.raw(`UPDATE users SET password = ?, updated_at = now() WHERE email = ?`, [hashedPassword, userEmail])
    }
}

