import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import SelectMember from "@/components/SelectMember.tsx";

const schema = z.object({
    options: z.array(z.optional(z.string()))
})

export default function AnswerQuestions() {
    const question = useQuery(api.questions.getCurrent)
    const submit = useMutation(api.questions.submit)
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            options: [
                undefined,
                undefined,
                undefined
            ]
        }
    });

    async function submitQuestion(data: typeof schema._type) {
        if (!question) return

        const options = data.options.filter(e => e) as string[]
        await submit({
            question: question._id,
            options
        })
        form.reset()
    }

    if (!question) return <h1>De vragen zijn op, joch!</h1>

    return (
        <Card className={"min-w-[600px]"}>
            <CardHeader>
                <CardTitle className={"text-center text-3xl"}>{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitQuestion)} className={"space-y-8"}>
                        <FormField
                            control={form.control}
                            name="options"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vraag</FormLabel>
                                    <div className={"flex flex-col gap-2"}>
                                        {field.value.map((value, index) => (
                                            <SelectMember key={index} value={value} onChange={(value) => {
                                                field.value[index] = value
                                                field.onChange([...field.value])
                                            }} type={question.answerWith} />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className={"w-full"} type="submit">Volgende vraag</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
