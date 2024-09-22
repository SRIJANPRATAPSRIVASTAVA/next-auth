"use client"

import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./backbutton";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string,
    backButtonLabel: string,
    backButtonHref: string,
    showSocial?: boolean
}

const CardWrapper = ({ children, headerLabel, backButtonHref, backButtonLabel, showSocial }: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
                {children}
            </CardHeader>
            {
                showSocial && (
                    <CardFooter>
                        <Social />
                    </CardFooter>
                )
            }
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    )
}

export default CardWrapper