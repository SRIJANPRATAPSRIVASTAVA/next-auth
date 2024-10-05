import { db } from "@/lib/db"

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const password = await db.passwordResetToken.findUnique({
            where: { token }
        })
        return password
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const password = await db.passwordResetToken.findFirst({
            where: { email }
        })
        return password
    } catch {
        return null;
    }
}