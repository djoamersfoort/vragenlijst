import {GenericQueryCtx} from "convex/server";

export async function ensureIdentity(ctx: GenericQueryCtx<any>) {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    return identity
}
