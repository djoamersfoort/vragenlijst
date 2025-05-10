import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {useRef, useState} from "react";
import {CheckCircle} from "lucide-react";
import FormCard from "@/components/FormCard.tsx";

const schema = z.object({
    question: z.string(),
    answerWith: z.enum(["tutor", "member", "all"])
})

export default function AddQuestion() {
    const loadingRef = useRef<boolean>(false);
    const [created, setCreated] = useState<boolean>(false);
    const create = useMutation(api.questions.create)
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            question: '',
            answerWith: 'all' as 'all'
        }
    });

    async function submit(data: typeof schema._type) {
        if (loadingRef.current) return

        loadingRef.current = true;
        await create(data)
        setCreated(true)

        form.reset()
        loadingRef.current = false;
    }

    return (
        <>
            <Dialog open={created} onOpenChange={setCreated}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className={"flex gap-2 items-center"}><CheckCircle /> Vraag aangemaakt</DialogTitle>
                        <DialogDescription>We tonen je vraag bij de volgende ronde</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit">OK</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <FormCard>
                <CardHeader>
                    <CardTitle className={"text-center text-3xl"}>Voeg een vraag toe</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)} className={"space-y-8"}>
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vraag</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="answerWith"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Antwoord met</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="tutor">Begeleiders</SelectItem>
                                                    <SelectItem value="member">Leden</SelectItem>
                                                    <SelectItem value="all">Begeleiders + leden</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className={"w-full"} type="submit">Maak vraag!</Button>
                        </form>
                    </Form>
                </CardContent>
            </FormCard>
        </>
    )
}
