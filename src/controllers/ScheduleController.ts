import { Express, Request, Response, NextFunction, Router } from "express";
import ScheduleRepository from "../repositories/ScheduleRepository";
import AuthGuard from "../middlewares/AuthGuard";

export default class ScheduleController {
  private scheduleRepository: ScheduleRepository;
  private router: Router;

  constructor(server: Express) {
    this.scheduleRepository = new ScheduleRepository();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const schedules = await this.scheduleRepository.getAllSchedules();
        response.status(200).send(schedules);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting schedules.");
      }
    });

    this.router.get("/:id", async (request, response) => {
      try {
        const schedule = await this.scheduleRepository.getScheduleById(
          request.params.id
        );
        response.status(200).send(schedule);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting schedule.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const schedule = await this.scheduleRepository.createSchedule(
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
          const schedule = await this.scheduleRepository.updateSchedule(
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
          await this.scheduleRepository.deleteSchedule(request.params.id);
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
