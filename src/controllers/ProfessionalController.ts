import { Express, Router, Request, Response, NextFunction } from "express";
import ProfessionalRepository from "../repositories/ProfessionalRepository";
import AuthGuard from "../middlewares/AuthGuard";

export default class ProfessionalController {
  private professionalRepository: ProfessionalRepository;
  private router: Router;

  constructor(server: Express) {
    this.professionalRepository = new ProfessionalRepository();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const professionals =
          await this.professionalRepository.getAllProfessionals();
        response.status(200).send(professionals);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting professionals.");
      }
    });

    this.router.get("/:id", async (request, response) => {
      try {
        const professional =
          await this.professionalRepository.getProfessionalById(
            request.params.id
          );
        response.status(200).send(professional);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting professional.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const professional =
          await this.professionalRepository.createProfessional(request.body);
        response.status(200).send(professional);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating professional.");
      }
    });

    this.router.put(
      "/update",

      async (request, response) => {
        try {
          const professional =
            await this.professionalRepository.updateProfessional(request.body);
          response.status(200).send(professional);
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while updating professional.");
        }
      }
    );

    this.router.delete(
      "/delete/:id",

      async (request, response) => {
        try {
          await this.professionalRepository.deleteProfessional(
            request.params.id
          );
          response.status(200).send("Professional successfully deleted.");
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while deleting professional.");
        }
      }
    );

    server.use("/professionals", this.router);
  }
}
