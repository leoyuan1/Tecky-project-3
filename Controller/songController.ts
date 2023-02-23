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

    songList = async (req: express.Request, res: express.Response) => {
        try {
            console.log('123');
            let songList = await this.songService.getSongList()
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
}