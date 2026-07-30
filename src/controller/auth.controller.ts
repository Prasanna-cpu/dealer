import {NextFunction, Request, Response} from "express";
import logger from "../config/logger";
import {loginSchema, signupSchema} from "../validations/auth.validation";
import {formatValidationError} from "../format/format";
import {users} from "../models/user.model";
import db from "../database/database";
import {eq} from "drizzle-orm";
import {authenticateUser, createUser} from "../services/auth.services";
import {jwtToken} from "../auth/jwt";
import {cookies} from "../auth/cookie";


export async function signup(req: Request, res: Response, next: NextFunction) {

    try{
        const validation = signupSchema.safeParse(req.body)

        if(!validation.success) {
            return res.status(400).json({
                message: "Invalid Input",
                error: formatValidationError(validation.error)
            })
        }

        const {name, email, password, role} = validation.data

        const existingUserCheck = await db.select().from(users).where(eq(users.email, email)).execute()

        if (existingUserCheck.length > 0) {
            return res.status(400).json({
                status : res.statusCode,
                message: "User already exists with this email"
            })
        }

        const user = await createUser(name, email, password, role)

        const token = jwtToken.sign({
            id : user.id,
            email : user.email,
            role : user.role
        })

        cookies.set(res, 'token', token)

        logger.info(`User registered successfully: ${email}`);
        return res.status(201).json({
            status : res.statusCode,
            message: 'User registered',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch(e){
        logger.error("Error in sign up", e)
        res.status(500).json({
            message: "Sign Up Failed",
            error: (e as Error).message
        })
        next(e)
    }

}

export async function login(req: Request, res: Response) {
    try{
        const validationResult = loginSchema.safeParse(req.body)

        if(!validationResult.success) {
            return res.status(400).json({
                message: "Invalid Input",
                error: formatValidationError(validationResult.error)
            })
        }

        const {email, password} = validationResult.data

        const user = await authenticateUser(email, password)

        logger.info(`User signed in successfully: ${email}`);
        res.status(200).json({
            message: 'User signed in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch(e){
        res.status(500).json({
            message: "Login Failed",
            error: (e as Error).message
        })
    }

}

export async function logout(req: Request, res: Response) {
    try{
        cookies.clear(res, 'token');

        logger.info('User signed out successfully');
        res.status(200).json({
            message: 'User signed out successfully',
        });
    }
    catch(e){
        res.status(500).json({
            message: "Login Failed",
            error: (e as Error).message
        })
    }

}