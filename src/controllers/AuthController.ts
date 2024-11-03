import { Express, Router } from "express";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import JwtService from "../services/JwtService";

export default class AuthController {
  private userRepository: UserRepository;
  private router: Router;

  constructor(server: Express) {
    this.userRepository = new UserRepository();
    this.router = Router();

    this.router.post("/", async (request, response) => {
      try {
        const { email, password } = request.body;
        const user = await this.userRepository.getUserByEmail(email);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error();
        }

        const accessToken = JwtService.generateToken(user);
        response.status(200).send({ accessToken });
      } catch (error) {
        console.log(error);
        response.status(500).send("Error while authenticating.");
      }
    });

    server.use("/auth", this.router);
  }
}
