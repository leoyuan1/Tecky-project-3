import express from "express";
import { SongController } from "./Controller/songController";
import { SongService } from "./Service/songService";
import { knex } from './util/db';

export const songService = new SongService(knex)
export const songController = new SongController(songService)
// import session from "express-session";

export const songRoutes = express.Router()


// export function makeUserRoutes() {
// userRoutes.get('/admin', keepLogin)
songRoutes.get('/get-song', songController.songList)
// }