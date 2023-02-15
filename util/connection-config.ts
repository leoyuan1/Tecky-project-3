import express from 'express'
import cors from "cors"
import http from "http"

export const PORT = 8080;
export const app = express()

app.use(cors())

export const server = new http.Server(app);
