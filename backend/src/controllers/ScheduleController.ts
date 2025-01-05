import { Express, Router, Request, Response } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import ScheduleService from "../services/ScheduleService";

export default class ScheduleController {
  private scheduleService: ScheduleService;

  constructor(server: Express) {
    this.scheduleService = new ScheduleService();
    const router = Router();

    router.use(AuthGuard.verifyAuthencation);
    router.get("/", this.getSchedulesByProfessionalAndDate.bind(this));
    router.post("/new", this.createSchedule.bind(this));
    router.put("/update", this.updateSchedule.bind(this));
    router.delete("/delete/:id", this.deleteSchedule.bind(this));

    server.use("/schedules", router);
  }

  private async getSchedulesByProfessionalAndDate(
    request: Request,
    response: Response
  ) {
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
  }

  private async createSchedule(request: Request, response: Response) {
    try {
      const schedule = await this.scheduleService.createSchedule(request.body);
      response.status(200).send(schedule);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while creating schedule.");
    }
  }

  private async updateSchedule(request: Request, response: Response) {
    try {
      const schedule = await this.scheduleService.updateSchedule(request.body);
      response.status(200).send(schedule);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while updating schedule.");
    }
  }

  private async deleteSchedule(request: Request, response: Response) {
    try {
      await this.scheduleService.deleteSchedule(request.params.id);
      response.status(200).send("Schedule successfully deleted.");
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while deleting schedule.");
    }
  }
}
