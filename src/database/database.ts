import dotenv from "dotenv";
import {neon, neonConfig} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http"
dotenv.config();

if(process.env.DATABASE_URL == "" || process.env.DATABASE_URL == undefined) throw new Error("Error in connecting DB error E-1")

const sql = neon(process.env.DATABASE_URL as string)

const db = drizzle(sql)


export default db


