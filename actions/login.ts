"use server"

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email doesn't exists !!" }
    }

    if (!existingUser.emailVerified) {
        const VerificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(VerificationToken.email, VerificationToken.token);
        return { success: "Confirmation email sent!!" } // but some users might still login, so we have to protect it using the singIn nextAuth function
    }

    try {
        await signIn("credentials",
            {
                email,
                password,
                redirectTo: DEFAULT_LOGIN_REDIRECT
            }
        )
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        error: "Invalid Credentials"
                    }
                    break;
                default:
                    return {
                        error: "Something went wrong!"
                    }
                    break;
            }
        }
        throw error;
    }
} 