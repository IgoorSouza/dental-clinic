import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Professional from "../types/professional";

export default class ProfessionalRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getAllProfessionals() {
    return await this.prisma.professional.findMany();
  }

  async getProfessionalById(id: string) {
    return await this.prisma.professional.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createProfessional(professional: Professional) {
    return await this.prisma.professional.create({
      data: professional,
    });
  }

  async updateProfessional(professional: Professional) {
    return await this.prisma.professional.update({
      where: { id: professional.id },
      data: professional,
    });
  }

  async deleteProfessional(id: string) {
    return await this.prisma.professional.delete({
      where: {
        id,
      },
    });
  }
}
