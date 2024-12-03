import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import User from "../interfaces/user";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  async createUser(user: User): Promise<User> {
    const encryptedPassword = await bcrypt.hash(user.password, 10);

    return await this.userRepository.createUser({
      ...user,
      password: encryptedPassword,
    });
  }

  async updateUser(user: User): Promise<User> {
    if (user.email === process.env.OWNER_EMAIL) {
      throw new Error("Not possible to change the system's owner data.");
    }

    const encryptedPassword = user.password
      ? await bcrypt.hash(user.password, 10)
      : undefined;

    return await this.userRepository.updateUser({
      ...user,
      password: encryptedPassword!,
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error("There's no user with the informed id.");
    }

    if (user.email === process.env.OWNER_EMAIL) {
      throw new Error("Not possible to delete the system's owner.");
    }

    await this.userRepository.deleteUser(id);
  }
}
