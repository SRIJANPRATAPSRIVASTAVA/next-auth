import { ExtendedUser } from "@/next-auth"
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string
}

export const UserInfo = ({
    user,
    label
}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        ID
                    </p>
                    <p className="text-xs font-bold truncate font-mono p-1 bg-slate-100 rounded-md max-w-[100px]">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Username
                    </p>
                    <p className="text-xs font-bold truncate font-mono p-1 bg-slate-100 rounded-md max-w-[100px]">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Role
                    </p>
                    <p className="text-xs font-bold truncate font-mono p-1 bg-slate-100 rounded-md max-w-[100px]">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="text-xs font-bold truncate font-mono p-1 bg-slate-100 rounded-md max-w-[100px]">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Two Factor Authentication
                    </p>
                    <Badge variant={user?.istwoFactorEnabled ? "success" : "destructive"}>
                        {user?.istwoFactorEnabled ? "ON" : "OFF"}
                    </Badge>
                </div>
            </CardContent>
        </Card>)
}