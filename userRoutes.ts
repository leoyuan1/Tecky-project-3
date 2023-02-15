import express from "express";
import { userController } from "./app";

// import session from "express-session";

export const userRoutes = express.Router()
// userRoutes.get('/admin', keepLogin)
userRoutes.post('/signup', userController.signup)
userRoutes.post('/login', userController.login)
userRoutes.get('/login/google', userController.loginGoogle)
userRoutes.get('/session', userController.isUser)
userRoutes.post('/change', userController.changePassword)
userRoutes.get('/logout', userController.logout)
userRoutes.get('/user-id', userController.getUserID)