"use server"

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import bcryptjs from 'bcryptjs';
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { password, email, name } = validateFields.data
    const hashedPassword = await bcryptjs.hash(password, 10);

    /**
     * * check if email is not taken
     */
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "Email is already  registered!" }
    }

    await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    })

    const VerificationToken = await generateVerificationToken(email);
    console.log("VerificationToken", VerificationToken);

    await sendVerificationEmail(VerificationToken.email, VerificationToken.token)

    return { Success: "Email Sent" }
}

