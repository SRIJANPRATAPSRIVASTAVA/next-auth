import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "email is required"
    }),
    password: z.string()
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(3, {
        message: "name is required"
    })
})