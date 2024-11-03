import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import User from "../types/user";

export default class UserRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  async createUser(user: User) {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async updateUser(user: User) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
