import { Express, Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import AuthGuard from "../middlewares/AuthGuard";

export default class UserController {
  private userRepository: UserRepository;
  private router: Router;

  constructor(server: Express) {
    this.userRepository = new UserRepository();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const users = await this.userRepository.getAllUsers();
        response.status(200).send(users);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting users.");
      }
    });

    this.router.get("/:id", async (request, response) => {
      try {
        const user = await this.userRepository.getUserById(request.params.id);
        response.status(200).send(user);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting user.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const user = request.body;
        const encryptedPassword = await bcrypt.hash(user.password, 10);

        await this.userRepository.createUser({
          ...user,
          password: encryptedPassword,
        });

        response.status(200).send("User successfully created.");
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating user.");
      }
    });

    this.router.put("/update", async (request, response) => {
      try {
        const user = await this.userRepository.updateUser(request.body);
        response.status(200).send(user);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while updating user.");
      }
    });

    this.router.delete("/delete/:id", async (request, response) => {
      try {
        await this.userRepository.deleteUser(request.params.id);
        response.status(200).send("User successfully deleted.");
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while deleting user.");
      }
    });

    server.use("/users", this.router);
  }
}
