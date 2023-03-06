import express from "express";
import { knex } from './util/db';

import { UserController } from "./Controller/userController";
import { UserService } from "./Service/userService";

export const userService = new UserService(knex)
export const userController = new UserController(userService)

export const userRoutes = express.Router()


userRoutes.post('/signup', userController.signup)
userRoutes.post('/login', userController.login)
userRoutes.get('/login/google', userController.loginGoogle)
userRoutes.get('/session', userController.isUser)
userRoutes.post('/change', userController.changePassword)
userRoutes.get('/logout', userController.logout)
userRoutes.get('/user-id', userController.getUserID)