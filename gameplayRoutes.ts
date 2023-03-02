import express from "express";
import { GameplayController } from "./Controller/gameplayController";
import { GameplayService } from "./Service/gameplayService";
import { knex } from './util/db';

export const gameplayService = new GameplayService(knex)
export const gameplayController = new GameplayController(gameplayService)

export const gameplayRoutes = express.Router()

gameplayRoutes.post('/get-video', gameplayController.getSongById)
gameplayRoutes.post('/get-history-scores', gameplayController.getHistoryScoresById)