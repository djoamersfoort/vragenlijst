import * as React from "react";
import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";

export default function FormCard({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <Card
            className={cn(
                "w-full bg-background border-0 sm:border-1 sm:bg-card max-w-[640px]",
                className
            )}
            {...props}
        />
    )
}