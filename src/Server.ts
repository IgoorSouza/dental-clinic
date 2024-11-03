import express, { Express, Router } from "express";
import cors from "cors";
import UserController from "./controllers/UserController";
import CustomerController from "./controllers/CustomerController";
import ProfessionalController from "./controllers/ProfessionalController";
import PaymentController from "./controllers/PaymentController";
import ScheduleController from "./controllers/ScheduleController";
import AuthController from "./controllers/AuthController";

export default class Server {
  private server: Express;

  constructor(port: string) {
    this.server = express();
    this.server.use(cors({ origin: process.env.FRONTEND_URL }));
    this.server.use(express.json());

    new UserController(this.server);
    new CustomerController(this.server);
    new PaymentController(this.server);
    new ScheduleController(this.server);
    new ProfessionalController(this.server);
    new AuthController(this.server);

    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
