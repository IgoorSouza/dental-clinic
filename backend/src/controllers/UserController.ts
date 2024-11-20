import { Express, Router } from "express";
import bcrypt from "bcrypt";
import UserService from "../services/UserService";
import AuthGuard from "../middlewares/AuthGuard";
import { Role } from "@prisma/client";

export default class UserController {
  private userService: UserService;
  private router: Router;

  constructor(server: Express) {
    this.userService = new UserService();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const users = await this.userService.getUsers();
        response.status(200).send(users);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting users.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const user = request.body;
        const encryptedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await this.userService.createUser({
          ...user,
          password: encryptedPassword,
        });

        response.status(200).send(newUser);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating user.");
      }
    });

    this.router.put("/update", async (request, response) => {
      try {
        const user = request.body;

        if (
          user.email === process.env.OWNER_EMAIL &&
          user.role !== Role.OWNER
        ) {
          throw new Error("Not possible to change the system's owner data.");
        }

        const encryptedPassword = user.password
          ? await bcrypt.hash(user.password, 10)
          : undefined;
        const updatedUser = await this.userService.updateUser({
          ...user,
          password: encryptedPassword,
        });
        response.status(200).send(updatedUser);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while updating user.");
      }
    });

    this.router.delete("/delete/:id", async (request, response) => {
      try {
        const id = request.params.id;
        const user = await this.userService.getUserById(id);
        if (!user) throw new Error("There's no user with the informed id.");
        if (user.email === process.env.OWNER_EMAIL)
          throw new Error("Not possible to delete the system's owner.");

        await this.userService.deleteUser(id);
        response.status(200).send("User successfully deleted.");
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while deleting user.");
      }
    });

    server.use("/users", this.router);
  }
}
