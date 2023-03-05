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

    async getUserScoreById(userId: Number) {
        let result = (await this.knex
            .first()
            .select('scores')
            .from('scores')
            .where('user_id', userId))
        return result
    }

    async updateUserRecord(userId: string, newScore: Number) {
        await this.knex('scores')
            .update({
                scores: newScore
            })
            .where('user_id', userId)
    }
}