import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import User from "../types/user";

export default class UserRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: User): Promise<User> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async updateUser(user: User): Promise<User> {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
