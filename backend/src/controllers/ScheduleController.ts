import { Express, Router } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import ScheduleService from "../services/ScheduleService";

export default class ScheduleController {
  private scheduleService: ScheduleService;
  private router: Router;

  constructor(server: Express) {
    this.scheduleService = new ScheduleService();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const { date, professionalId } = request.query;
        const schedules =
          await this.scheduleService.getSchedulesByProfessionalAndDate(
            professionalId as string,
            date as string
          );
        response.status(200).send(schedules);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting schedules.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const schedule = await this.scheduleService.createSchedule(
          request.body
        );
        response.status(200).send(schedule);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating schedule.");
      }
    });

    this.router.put(
      "/update",

      async (request, response) => {
        try {
          const schedule = await this.scheduleService.updateSchedule(
            request.body
          );
          response.status(200).send(schedule);
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while updating schedule.");
        }
      }
    );

    this.router.delete(
      "/delete/:id",

      async (request, response) => {
        try {
          await this.scheduleService.deleteSchedule(request.params.id);
          response.status(200).send("Schedule successfully deleted.");
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while deleting schedule.");
        }
      }
    );

    server.use("/schedules", this.router);
  }
}
