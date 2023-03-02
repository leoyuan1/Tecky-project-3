import { Knex } from "knex";

export class GameplayService {
    constructor(private knex: Knex) { }

    async getSongById(mediaId: number) {
        let id = mediaId
        let result = (
            await this.knex
                .select('video')
                .from('media')
                .where({ id })
        )
        return result
    }

    async getHistoryScoresById(mediaId: number) {
        let media_id = mediaId
        console.log("media_id: ", media_id);

        let results = (
            await this.knex.raw(`
            select scores, username from scores
            join users on users.id = scores.user_id
            where media_id = ?
            ORDER BY scores DESC`,
                [media_id])
        ).rows
        console.log("results: ", results);
        return results
    }
}