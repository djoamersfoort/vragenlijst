"use client";

import {Authenticated, Unauthenticated, useQuery,} from "convex/react";
import {api} from "../convex/_generated/api";
import {useAuthActions} from "@convex-dev/auth/react";
import {Button} from "@/components/ui/button.tsx";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import AddQuestion from "@/states/AddQuestion.tsx";
import AnswerQuestions from "@/states/AnswerQuestions.tsx";
import Results from "@/states/Results.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import FormCard from "@/components/FormCard.tsx";

export default function App() {
    const [open, setOpen] = useState(!localStorage.getItem('instructions'));
    function onOpenChange(open: boolean) {
        setOpen(open)
        localStorage.setItem('instructions', 'true');
    }

    return (
        <>
            <main className="flex flex-col justify-center items-center w-screen h-screen">
                <Authenticated>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className={"max-w-screen"}>
                            <DialogHeader className={"mb-4"}>
                                <DialogTitle className={"text-center text-2xl"}>Welkom bij DJO Vragenlijst</DialogTitle>
                                <DialogDescription className={"text-center text-xl"}>De DJO Vragenlijst verloopt in 3 fasen</DialogDescription>
                            </DialogHeader>

                            <div className={"flex flex-col gap-2"}>
                                <div className={"flex gap-4 items-center"}>
                                    <Badge>1.</Badge>
                                    <span>Je krijgt eerst de mogelijkheid om vragen in te sturen, deze worden later beantwoord met de top 3 begeleiders of leden die bij deze vraag passen</span>
                                </div>
                                <Separator />
                                <div className={"flex gap-4 items-center"}>
                                    <Badge>2.</Badge>
                                    <span>Iedereen krijgt tegelijk de mogelijkheid om de gemaakte vragen in te vullen</span>
                                </div>
                                <Separator />
                                <div className={"flex gap-4 items-center"}>
                                    <Badge>3.</Badge>
                                    <span>Iedereen krijgt tegelijkertijd de ranglijst van de resultaten van de vragenlijst te zien</span>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button>Ik heb dit gelezen</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Content />
                </Authenticated>
                <Unauthenticated>
                    <SignInForm />
                </Unauthenticated>
            </main>
        </>
    );
}

function SignInForm() {
    const {signIn} = useAuthActions();

    return (
        <FormCard className={"text-center w-full bg-background border-0 sm:border-1 sm:bg-card max-w-[640px]"}>
            <CardHeader>
                <CardTitle className={"text-2xl"}>Log in jij joch!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
                <Button onClick={() => void signIn('djo')}>DJO</Button>
            </CardContent>
        </FormCard>
    );
}

function Content() {
    const state = useQuery(api.state.get)
    if (state === 'create') return <AddQuestion />
    if (state === 'answer') return <AnswerQuestions />

    return <Results />
}
