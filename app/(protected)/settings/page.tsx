"use client"

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const page = () => {
    // const session = useSession()
    const user = useCurrentUser()
    const onClick = () => {
        // signOut()
        logout()
    }
    return (
        <div>
            <div className="bg-white p-10 rounded-xl">
                <Button type="submit" onClick={onClick}>
                    SignOut
                </Button>
            </div>
        </div>
    )
}

export default page