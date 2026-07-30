import express from "express"
import {login, signup, logout} from "../controller/auth.controller";
import {authRateLimiter} from "../security/rate-limiter";

const authRouter = express.Router()

authRouter.post("/signup", authRateLimiter, signup)
authRouter.post("/login", authRateLimiter, login)
authRouter.post("/logout", logout)


export default authRouter