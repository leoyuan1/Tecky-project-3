import express from "express";
import { SongController } from "./Controller/songController";
import { SongService } from "./Service/songService";
import { knex } from './util/db';

export const songService = new SongService(knex)
export const songController = new SongController(songService)

export const songRoutes = express.Router()

songRoutes.post('/get-song', songController.getSongList)
songRoutes.get('/get-song-list', songController.allSongList)
songRoutes.post('/get-ranking', songController.getSongListBySongName)
songRoutes.get('/get-user-total-song', songController.getUserTotalSong)