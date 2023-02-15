import express from 'express'
import { app, PORT, server } from './util/connection-config';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})