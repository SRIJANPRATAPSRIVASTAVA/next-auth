"use server"

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, code } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email doesn't exists !!" }
    }

    if (!existingUser.emailVerified) {
        const VerificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(VerificationToken.email, VerificationToken.token);
        return { success: "Confirmation email sent!!" } // but some users might still login, so we have to protect it using the singIn nextAuth function
    }

    if (existingUser.istwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if (!twoFactorToken) {
                return { error: "Invalid code" }
            }
            if (twoFactorToken.token !== code) {
                return { error: "Invalid code" }
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "Code expired!" }
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
            if (existingConfirmation) {
                // Safely delete the record if it exists
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id // Ensure you're using the confirmation record's id
                    }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )
            return { twoFactor: true }
        }
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