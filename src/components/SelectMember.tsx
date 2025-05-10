"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";

export default function SelectMember({ type, value, onChange }: { type: 'tutor'|'member'|'all', value: string|undefined, onChange: (value: string|undefined) => void }) {
    const [open, setOpen] = React.useState(false)
    const list = useQuery(api.members.get, { type })

    if (!list) return <p>Loading...</p>
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex-1 justify-between"
                >
                    {value && list.find((item) => item._id === value)?.name}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[510px] p-0">
                <Command>
                    <CommandInput placeholder="Zoek leden..." className="h-9" />
                    <CommandList>
                        <CommandGroup>
                            {list.map((item) => (
                                <CommandItem
                                    key={item._id}
                                    value={item.name}
                                    onSelect={() => {
                                        onChange(item._id === value ? "" : item._id)
                                        setOpen(false)
                                    }}
                                >
                                    {item.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
