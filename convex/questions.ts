import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {ensureIdentity} from "./utils";
import {Id} from "./_generated/dataModel";

export const create = mutation({
    args: {
        question: v.string(),
        answerWith: v.union(v.literal("tutor"), v.literal("member"), v.literal("all"))
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

        await ctx.db.insert('questions', {
            creator: identity.subject,
            question: args.question,
            answerWith: args.answerWith
        })
    }
})

export const getCurrent = query({
    args: {},
    async handler(ctx) {
        const identity = await ensureIdentity(ctx)

        const questions = await ctx.db.query("questions")
            .collect()

        for (const question of questions) {
            const response = await ctx.db.query("answers")
                .filter(q => q.and(q.eq(q.field("question"), question._id), q.eq(q.field("responder"), identity.subject)))
                .first()

            if (!response) return question
        }
    }
})

export const submit = mutation({
    args: {
        question: v.id("questions"),
        options: v.array(v.string())
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

        const response = await ctx.db.query("answers")
            .filter(q => q.and(q.eq(q.field("question"), args.question), q.eq(q.field("responder"), identity.subject)))
            .first()
        if (response) throw new Error('Already answered!')

        const results = args.options
            .map(e => ctx.db.normalizeId("members", e))
            .filter(e => e) as Id<"members">[]

        await ctx.db.insert("answers", {
            responder: identity.subject,
            question: args.question,
            results
        })
    }
})

export const getResults = query({
    args: {},
    async handler(ctx) {
        await ensureIdentity(ctx)

        const questions = await ctx.db.query("questions")
            .collect()

        return await Promise.all(questions.map(async question => {
            const results = await ctx.db.query("answers")
                .filter(q => q.eq(q.field("question"), question._id))
                .collect()

            const names: Record<string, number> = {}
            results.forEach(result => {
                result.results.forEach((result, index) => {
                    if (!names[result]) names[result] = 0

                    names[result] += Math.max(0, 3 - index)
                })
            })

            const list = Array.from(Object.entries(names))
                .map(([name, points]) => ({
                    name, points
                }))
                .sort((a, b) => b.points - a.points)

            return {
                question,
                list
            }
        }))
    }
})
