import { Express, Router, Request, Response } from "express";
import ProfessionalService from "../services/ProfessionalService";
import AuthGuard from "../middlewares/AuthGuard";

export default class ProfessionalController {
  private professionalService: ProfessionalService;

  constructor(server: Express) {
    this.professionalService = new ProfessionalService();
    const router = Router();

    router.use(AuthGuard.verifyAuthencation);
    router.get("/", this.getProfessionals.bind(this));
    router.post("/new", this.createProfessional.bind(this));
    router.put("/update", this.updateProfessional.bind(this));
    router.delete("/delete/:id", this.deleteProfessional.bind(this));

    server.use("/professionals", router);
  }

  private async getProfessionals(request: Request, response: Response) {
    try {
      const professionals = await this.professionalService.getProfessionals();
      response.status(200).send(professionals);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while getting professionals.");
    }
  }

  private async createProfessional(request: Request, response: Response) {
    try {
      const professional = await this.professionalService.createProfessional(
        request.body
      );
      response.status(200).send(professional);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while creating professional.");
    }
  }

  private async updateProfessional(request: Request, response: Response) {
    try {
      const professional = await this.professionalService.updateProfessional(
        request.body
      );
      response.status(200).send(professional);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while updating professional.");
    }
  }

  private async deleteProfessional(request: Request, response: Response) {
    try {
      await this.professionalService.deleteProfessional(request.params.id);
      response.status(200).send("Professional successfully deleted.");
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while deleting professional.");
    }
  }
}
