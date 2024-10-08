import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from './data/user';
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // console.log({
            //     account,
            //     user
            // });
            // allow OAuth without email verification
            if (account?.provider !== "credentials") {
                return true
            }
            const existingUser = await getUserById(user.id as string);
            if (!existingUser?.emailVerified) {
                return false
            }
            // todo : add 2fa check

            if (existingUser.istwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                console.log({ twoFactorConfirmation });

                if (!twoFactorConfirmation) {
                    return false;
                }

                // delete 2 factor confirmation for next signIn
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id
                    }
                })
            }
            return true;
        },
        async session({ token, session }) {
            console.log({
                sessionToken: token
            });

            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            } // https://authjs.dev/getting-started/typescript

            if (session.user) {
                session.user.istwoFactorEnabled = token.istwoFactorEnabled as boolean;
            }
            return session
        },
        async jwt({ token }) {
            if (!token.sub) {
                return token
            }
            const existingUser = await getUserById(token.sub)
            if (!existingUser) {
                return token
            }
            token.role = existingUser?.role
            token.istwoFactorEnabled = existingUser.istwoFactorEnabled
            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})