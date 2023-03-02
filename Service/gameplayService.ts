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
            await this.knex
                .select('scores')
                .from('scores')
                .where({ media_id })
        )
        console.log("results: ", results);
        return results
    }
}