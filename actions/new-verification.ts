"use server"

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db";

export async function newVerification(token: string) {
    const existingToken = await getVerificationTokenByToken(token);
    console.log(existingToken);

    if (!existingToken) {
        return { error: "Token does not exists!! :(" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Please, generate a new token !! :)" }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "User does not exists !!" }
    }

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    // as this deletes the token and during the dev phase toke
    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return { success: "Email verified!!" }
}