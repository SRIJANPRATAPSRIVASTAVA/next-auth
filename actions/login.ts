"use server"

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validateFields.data;

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