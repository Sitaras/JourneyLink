import Agenda, { Job } from "agenda";
import { config } from "./config";

export const agenda = new Agenda({
  db: { address: config.mongodb.uri, collection: "agendaJobs" },
});

export const JobTypes = {
  COMPLETE_RIDE: "complete-ride",
};

export const startAgenda = async () => {
  agenda.define(JobTypes.COMPLETE_RIDE, async (job: Job) => {
    const { rideId } = job.attrs.data;

    const { rideService } = await import("../services/ride.service");
    await rideService.completeRide(rideId);
  });

  await agenda.start();
};
