import { db } from "@/lib/db"

export const getVerificationTokenByToken = async (
    token: string
) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                // email_token: {
                token: token
                // }
            }
        });
        console.log("verificationToken:");
        return verificationToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVerificationTokenByEmail = async (
    email: string
) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                email
            }
        })
        return verificationToken
    } catch {
        return null
    }
}