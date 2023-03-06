import { Knex } from "knex";

export class GameplayService {
    constructor(private knex: Knex) { }

    async getSongById(mediaId: Number) {
        let id = mediaId
        let result = (
            await this.knex
                .select('video')
                .from('media')
                .where({ id })
        )
        return result
    }

    async getHistoryScoresById(mediaId: Number) {
        let media_id = mediaId

        let results = (
            await this.knex.raw(`
            select scores, username from scores
            join users on users.id = scores.user_id
            where media_id = ?
            ORDER BY scores DESC`,
                [media_id])
        ).rows
        return results
    }

    async getVideoJsonById(mediaId: Number) {
        let id = mediaId

        let result = (await this.knex
            .select('pose_data', 'start_time', 'end_time')
            .from('media')
            .where({ id })
        )
        console.log(result);

        return result
    }

    async getUserScoreById(userId: Number, mediaId: Number) {
        let result = (
            await this.knex.raw(`
            select scores from scores
            where user_id = ? and media_id = ?`,
                [userId, mediaId])
        ).rows
        console.log("result: ", result);

        return result
    }

    async updateUserRecord(userId: Number, mediaId: Number, newScore: Number) {
        await this.knex.raw(`
            update scores set scores = ? where user_id = ? and media_id = ?
        `, [newScore, userId, mediaId])
    }


    async createUserRecord(userId: Number, mediaId: Number, score: Number) {
        await this.knex('scores').insert({
            scores: score,
            user_id: userId,
            media_id: mediaId
        })
    }
}