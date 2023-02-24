import { Knex } from "knex";

export class SongService {
    constructor(private knex: Knex) { }
    async getSongList(offset: number) {
        let songList = await this.knex.select('*').from('media').orderBy('id', 'desc').offset(offset).limit(6)
        return songList
    }

    async getAllSongList() {
        let allSongList = await this.knex.select('*').from('media')
        return allSongList
    }
}
