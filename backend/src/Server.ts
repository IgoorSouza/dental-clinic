import express, { Express } from "express";
import cors from "cors";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import UserController from "./controllers/UserController";
import CustomerController from "./controllers/CustomerController";
import PaymentController from "./controllers/PaymentController";
import ScheduleController from "./controllers/ScheduleController";
import ProfessionalController from "./controllers/ProfessionalController";
import AuthController from "./controllers/AuthController";
import UserService from "./services/UserService";

export default class Server {
  private server: Express;
  private userService: UserService;

  constructor(port: string) {
    this.server = express();
    this.userService = new UserService();

    this.server.use(cors({ origin: process.env.FRONTEND_URL }));
    this.server.use(express.json());
    this.createOwnerIfNotExists();
    this.initializeControllers();

    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  private initializeControllers(): void {
    new UserController(this.server);
    new CustomerController(this.server);
    new PaymentController(this.server);
    new ScheduleController(this.server);
    new ProfessionalController(this.server);
    new AuthController(this.server);
  }

  private async createOwnerIfNotExists(): Promise<void> {
    const owner = await this.userService.getUserByEmail(
      process.env.OWNER_EMAIL!
    );

    if (!owner) {
      await this.userService.createUser({
        name: process.env.OWNER_NAME!,
        email: process.env.OWNER_EMAIL!,
        password: await bcrypt.hash(process.env.OWNER_PASSWORD!, 10),
        role: Role.OWNER,
      });
    }
  }
}
