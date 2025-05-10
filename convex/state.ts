import {query} from "./_generated/server";

export const get = query({
    args: {},
    async handler() {
        return process.env.STATE as 'create'|'answer'|'results'
    }
})
