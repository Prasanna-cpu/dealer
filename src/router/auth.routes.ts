import express from "express"
import {login, signup, logout} from "../controller/auth.controller";

const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", logout)


export default authRouter