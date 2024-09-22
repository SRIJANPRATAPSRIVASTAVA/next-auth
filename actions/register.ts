"use server"
import bcrypt from "bcrypt"

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { password, email, name } = validateFields.data
    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * * check if email is not taken
     */
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "Email is already  registered!" }
    }

    const newUser = await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    })
    console.log(newUser);

    // TODO : SEND VERIFICATION TOKEN EMAIL

    return { Success: "Email Sent" }
}

