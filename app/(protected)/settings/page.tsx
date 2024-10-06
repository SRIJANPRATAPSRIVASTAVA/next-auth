"use client"

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const page = () => {
    const session = useSession()
    const onClick = () => {
        signOut()
    }
    return (
        <div>
            {JSON.stringify(session)}
            <Button type="submit" onClick={onClick}>
                SignOut
            </Button>
        </div>
    )
}

export default page