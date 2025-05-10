import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge";

export default function Results() {
    const results = useQuery(api.questions.getResults)
    const all = useQuery(api.members.get, { type: 'all' })
    if (!results || !all) return

    const { questions, totals } = results

    return (
        <div className={"w-full h-full"}>
            <div className={"flex flex-col h-full mx-8 p-8 gap-8"}>
                <h2 className={"text-4xl text-center"}>Resultaten</h2>

                <div className={"flex flex-col gap-2"}>
                    <h3 className={"text-2xl font-bold"}>Er is het meest gestemd op</h3>
                    <Carousel>
                        <CarouselContent>
                            {totals.slice(0, 3).map((result, i) => (
                                <CarouselItem>
                                    <div className={"p-1"}>
                                        <Card key={i} className={"flex-1"}>
                                            <CardHeader>
                                                <CardTitle className={"flex justify-between items-center"}>{i+1}. {all.find(({ _id }) => _id === result.name)!.name} <Badge>{result.points} punten</Badge></CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                <div className={"flex flex-col gap-2 flex-1"}>
                    <h3 className={"text-2xl font-bold"}>Vragen</h3>
                    <Carousel className={"flex-1 h-full"}>
                        <CarouselContent>
                            {questions.map((result, index) => (
                                <CarouselItem className={"lg:basis-1/3"} key={index}>
                                    <div className={"p-1 h-full"}>
                                        <Card className={"h-full text-center overflow-y-auto"}>
                                            <CardHeader>
                                                <CardTitle className={"text-xl"}>{result.question.question}</CardTitle>
                                            </CardHeader>
                                            <CardContent className={"flex flex-col gap-2"}>
                                                {result.list.map((item, index) => (
                                                    <div className={"flex justify-between font-bold w-full text-left"}>
                                                        <span>{index + 1}. {all.find(({ _id }) => _id === item.name)!.name}</span>
                                                        <Badge>{item.points} points</Badge>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </div>
    )
}
