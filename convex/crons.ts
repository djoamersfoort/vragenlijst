import {cronJobs} from "convex/server";
import {internal} from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Synchronize members",
    { hours: 12 },
    internal.members.synchronize
);

export default crons;
