import bcrypt from "bcrypt";
import JwtService from "../services/JwtService";
import UserRepository from "../repositories/UserRepository";
import AuthData from "../interfaces/auth-data";

export default class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async authenticate(email: string, password: string): Promise<AuthData> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid password");

    const accessToken = JwtService.generateToken(user);
    return { accessToken, email: user.email, role: user.role, name: user.name };
  }
}
