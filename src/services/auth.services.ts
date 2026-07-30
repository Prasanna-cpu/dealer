import logger from "../config/logger";
import bcrypt from "bcrypt";
import db from "../database/database";
import {users} from "../models/user.model";
import {eq} from "drizzle-orm";

export const hashPassword = async (password: string) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing');
    }
};


export const comparePassword = async (password:string, hashedPassword:string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        logger.error(`Error comparing password: ${e}`);
        throw new Error('Error comparing password');
    }
};


export const createUser = async (name : string, email : string, password : string, role ='user') => {
    try{
        const hashedPassword = await hashPassword(password)

        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password : hashedPassword,
                role
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.createdAt,
            });

        return newUser
    }
    catch (e) {
        logger.error(`Error creating the user: ${e}`);
        throw e;
    }
}

export const authenticateUser = async (email : string, password : string) => {
    try{
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).execute()
        if(!existingUser) throw new Error('User not found')

        const isPasswordValid = await comparePassword(password, existingUser.password)
        if(!isPasswordValid) throw new Error('Invalid password')

        logger.info(`User ${existingUser.email} authenticated successfully`);
        return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            created_at: existingUser.createdAt,
        };

    }
    catch (e) {
        logger.error(`Error authenticating user: ${e}`);
        throw e;
    }
}