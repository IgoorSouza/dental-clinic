import { Express, Router } from "express";
import ProfessionalService from "../services/ProfessionalService";
import AuthGuard from "../middlewares/AuthGuard";

export default class ProfessionalController {
  private professionalService: ProfessionalService;
  private router: Router;

  constructor(server: Express) {
    this.professionalService = new ProfessionalService();
    this.router = Router();

    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const professionals = await this.professionalService.getProfessionals();
        response.status(200).send(professionals);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting professionals.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const professional = await this.professionalService.createProfessional(
          request.body
        );
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
            await this.professionalService.updateProfessional(request.body);
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
          await this.professionalService.deleteProfessional(request.params.id);
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
