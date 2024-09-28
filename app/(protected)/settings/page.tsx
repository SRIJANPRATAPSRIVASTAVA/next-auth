import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";

const page = async () => {
    const session = await auth()
    return (
        <div>{
            JSON.stringify(session)}
            <form action={async () => {
                "use server";

                await signOut({
                    redirectTo: "/auth/login"
                })
            }}>
                <Button type="submit">
                    SignOut
                </Button>
            </form>
        </div>
    )
}

export default page