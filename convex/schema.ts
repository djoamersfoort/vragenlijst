import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  questions: defineTable({
    creator: v.string(),
    question: v.string(),
    answerWith: v.union(v.literal("tutor"), v.literal("member"), v.literal("all"))
  }),
  answers: defineTable({
    question: v.id("questions"),
    responder: v.string(),
    results: v.array(v.id("members"))
  }),
  members: defineTable({
    name: v.string(),
    tutor: v.boolean(),
  })
});
