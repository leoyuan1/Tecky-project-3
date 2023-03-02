import express from "express"
import { GameplayService } from "../Service/gameplayService"
import { logger } from "../util/logger";
import { User } from "../util/session"

declare module "express-session" {
    interface SessionData {
        user?: User;
    }
}

export class GameplayController {
    constructor(private gameplayService: GameplayService) { }


    getSongById = async (req: express.Request, res: express.Response) => {
        try {
            let { mediaId } = req.body

            let selectedSongPath = await this.gameplayService.getSongById(mediaId)
            res.json({
                data: selectedSongPath
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[GPS001] - Server Error'
            })
        }
    }

    getHistoryScoresById = async (req: express.Request, res: express.Response) => {
        try {
            let { mediaId } = req.body

            let historyScores = await this.gameplayService.getHistoryScoresById(mediaId)
            res.json({
                data: historyScores
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                message: '[GPS002] - Server Error'
            })
        }
    }
}