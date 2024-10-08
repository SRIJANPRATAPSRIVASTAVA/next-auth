import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user";
import bcryptjs from 'bcryptjs';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

// Notice this is only an object, not a full Auth.js instance
export default {
    // providers: [GitHub],
    providers: [
        Credentials({
            async authorize(credentials) {
                const validateFields = LoginSchema.safeParse(credentials);
                if (validateFields.success) {
                    const { email, password } = validateFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) {
                        return null
                    }
                    const match = await bcryptjs.compare(password, user.password);

                    if (match) {
                        return user
                    }
                }

                return null
            }
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }), // google api console
    ]
} satisfies NextAuthConfig

// this for triggering middleware instead of auth.ts