"use server"

import { LoginSchema } from "@/schemas";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // now validating at backend, because client side validation ca nalways be by passed
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    return { Success: "Email Sent" }
} 