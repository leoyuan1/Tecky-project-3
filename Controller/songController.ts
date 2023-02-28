import express from "express"
import { SongService } from "../Service/songService"
import { logger } from "../util/logger";
import { User } from "../util/session"

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}
export class SongController {
    constructor(private songService: SongService) { }

    getSongList = async (req: express.Request, res: express.Response) => {
        try {
            let offset = req.body.offset
            let songList = await this.songService.getSongList(offset)
            res.json({
                songList: songList
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[USR001] - Server error'
            })
        }
    }

    allSongList = async (req: express.Request, res: express.Response) => {
        try {
            let allSongList = await this.songService.getAllSongList()
            res.json({
                songList: allSongList
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[USR001] - Server error'
            })
        }
    }

    getFirstList = async (req: express.Request, res: express.Response) => {
        try {
            let { songName } = req.body
            let allSongList = await this.songService.getRankingInfo(songName)
            res.json({
                getRankingInfo: allSongList
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[USR001] - Server error'
            })
        }
    }
}