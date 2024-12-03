import { Express, Router, Request, Response } from "express";
import AuthService from "../services/AuthService";

export default class AuthController {
  private authService: AuthService;

  constructor(server: Express) {
    this.authService = new AuthService();
    const router: Router = Router();

    router.post("/", this.authenticate.bind(this));

    server.use("/auth", router);
  }

  private async authenticate(request: Request, response: Response) {
    try {
      const { email, password } = request.body;
      const authData = await this.authService.authenticate(email, password);
      response.status(200).send(authData);
    } catch (error) {
      console.error(error);
      response.status(500).send("Error while authenticating.");
    }
  }
}
