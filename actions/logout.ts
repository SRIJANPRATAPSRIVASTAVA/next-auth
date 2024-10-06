"use server"
// combination of client component and server action
import { signOut } from "@/auth"

export const logout = async () => {
    // perform some server action
    await signOut()
}