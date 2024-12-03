import { Express, Router, Request, Response } from "express";
import UserService from "../services/UserService";
import AuthGuard from "../middlewares/AuthGuard";

export default class UserController {
  private userService: UserService;

  constructor(server: Express) {
    this.userService = new UserService();
    const router = Router();

    router.use(AuthGuard.verifyAuthencation);
    router.get("/", this.getUsers.bind(this));
    router.post("/new", this.createUser.bind(this));
    router.put("/update", this.updateUser.bind(this));
    router.delete("/delete/:id", this.deleteUser.bind(this));

    server.use("/users", router);
  }

  private async getUsers(request: Request, response: Response) {
    try {
      const users = await this.userService.getUsers();
      response.status(200).send(users);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while getting users.");
    }
  }

  private async createUser(request: Request, response: Response) {
    try {
      const newUser = await this.userService.createUser(request.body);
      response.status(200).send(newUser);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while creating user.");
    }
  }

  private async updateUser(request: Request, response: Response) {
    try {
      const updatedUser = await this.userService.updateUser(request.body);
      response.status(200).send(updatedUser);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while updating user.");
    }
  }

  private async deleteUser(request: Request, response: Response) {
    try {
      const id = request.params.id;
      await this.userService.deleteUser(id);
      response.status(200).send("User successfully deleted.");
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while deleting user.");
    }
  }
}
