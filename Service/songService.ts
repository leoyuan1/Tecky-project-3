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

    async getRankingInfo(songName: string) {
        let getRankingInfo = (await this.knex.raw(` SELECT users.username, media.song_name, scores.scores 
        FROM scores
        JOIN users ON users.id = scores.user_id
        JOIN media ON scores.media_id = media.id
        WHERE media.song_name = ?
        ORDER BY scores DESC`, [songName])).rows
        console.log(getRankingInfo);

        return getRankingInfo
    }
}
