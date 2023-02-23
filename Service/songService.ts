import { Knex } from "knex";


export class SongService {
    constructor(private knex: Knex) { }
    async getSongList() {
        let songList = await this.knex.select('*').from('media')
        return songList
    }
}
