import z from "zod"

export const signupSchema = z.object({
    name : z.string().min(3).max(255),
    email : z.email().max(255).toLowerCase().trim(),
    password : z.string().min(3).max(255),
    role : z.string().optional()
})

export const loginSchema = z.object({
    email : z.email().max(255).toLowerCase().trim(),
    password : z.string().min(3).max(255)
})
