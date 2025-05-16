import {internalAction, internalMutation, query} from "./_generated/server";
import {v} from "convex/values";
import {ensureIdentity} from "./utils";
import { OAuth2Client } from "@badgateway/oauth2-client"
import {internal} from "./_generated/api";

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

export const saveMember = internalMutation({
    args: {
        djo_id: v.number(),
        name: v.string(),
        tutor: v.boolean(),
        photo: v.string()
    },
    async handler(ctx, args) {
        const existingMember = await ctx.db.query('members')
            .filter(q => q.eq(q.field("djo_id"), args.djo_id))
            .first()

        if (existingMember) {
            await ctx.db.patch(existingMember._id, args)
        } else {
            await ctx.db.insert("members", args)
        }
    }
})

const TUTOR_TYPES = ['begeleider', 'bestuur', 'aspirant']

export const synchronize = internalAction({
    args: {},
    async handler(ctx) {
        const client = new OAuth2Client({
            clientId: process.env.SMOELEN_ID as string,
            clientSecret: process.env.SMOELEN_SECRET as string,
            tokenEndpoint: 'https://leden.djoamersfoort.nl/o/token/'
        })

        const { accessToken: token } = await client.clientCredentials()

        const smoelen = await fetch('https://leden.djoamersfoort.nl/api/v1/smoelenboek?large=0', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(res => res.json() as Promise<any[]>)

        const values = smoelen.map(smoel => ({
            djo_id: smoel['id'] as number,
            name: `${smoel['first_name']} ${smoel['last_name'].split(' ').pop().slice(0, 1)}.`,
            tutor: !!TUTOR_TYPES.find(type => (smoel['types'] as string).includes(type)),
            photo: smoel['photo'] as string
        }))

        for (const value of values) {
            await ctx.runMutation(internal.members.saveMember, value)
        }
    }
})
