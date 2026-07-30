import express from "express"
import dotenv from "dotenv"
import loggerMiddleware from "./middleware/logger.middleware";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./config/logger";
import cookieParser from "cookie-parser";
import authRouter from "./router/auth.routes";
import standardRateLimiter from "./security/rate-limiter";
import {botUserAgentBlocker} from "./security/rate-limiter";
import {suspiciousRequestBlocker} from "./security/rate-limiter";

dotenv.config()

const app = express()

const port = process.env.PORT

app.use(loggerMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(morgan('combined', {
    stream : {
        write: (message : string) => logger.info(message.trim())
    }
}))
app.use(botUserAgentBlocker)
app.use(suspiciousRequestBlocker)
app.use(standardRateLimiter)

app.get("/health", (req, res) => {
    res.json({ message: "OK" , status: 200})
})

app.use("/api/auth", authRouter)


app.get("/", (req, res) => {
    res.send("Hello World!")
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
