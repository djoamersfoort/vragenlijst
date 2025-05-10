import {query} from "./_generated/server";
import {v} from "convex/values";
import {ensureIdentity} from "./utils";

export const get = query({
    args: {
        type: v.union(v.literal("member"), v.literal("tutor"), v.literal("all"))
    },
    async handler(ctx, args) {
        await ensureIdentity(ctx)

        return await ctx.db.query("members")
            .filter(q => args.type === 'all' ? true : q.eq(q.field("tutor"), args.type === 'tutor'))
            .collect()
    }
})
