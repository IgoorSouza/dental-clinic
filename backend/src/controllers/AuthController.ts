import { Express, Router, Request, Response } from "express";
import AuthService from "../services/AuthService";

export default class AuthController {
  private authService: AuthService;
  private router: Router;

  constructor(server: Express) {
    this.authService = new AuthService();
    this.router = Router();

    this.router.post("/", async (request, response) => {
      try {
        const { email, password } = request.body;
        const authData = await this.authService.authenticate(email, password);
        response.status(200).send(authData);
      } catch (error) {
        console.error(error);
        response.status(500).send("Error while authenticating.");
      }
    });

    server.use("/auth", this.router);
  }
}
