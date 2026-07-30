import jwt from "jsonwebtoken";
import logger from "../config/logger";

const JWT_SECRET = process.env.JWT_SECRET as string
const EXPIRATION = '1d'

if(JWT_SECRET === "" || JWT_SECRET === undefined) throw new Error("JWT_SECRET is not defined")

export const jwtToken = {
    sign : (payload: any) => {
        try{
            return jwt.sign(payload, JWT_SECRET, {expiresIn: EXPIRATION})
        }
        catch (e) {
            logger.error("Error in signing JWT token", e)
            throw new Error("Error in signing JWT token")
        }
    },
    verify : (token: string) => {
        try{
            return jwt.verify(token, JWT_SECRET)
        }
        catch (e) {
            logger.error("Error in verifying JWT token", e)
            throw new Error("Error in verifying JWT token")
        }
    }
}