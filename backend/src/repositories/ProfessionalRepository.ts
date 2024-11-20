import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Professional from "../types/professional";

export default class ProfessionalRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getProfessionals(): Promise<Professional[]> {
    return await this.prisma.professional.findMany();
  }

  async createProfessional(professional: Professional): Promise<Professional> {
    return await this.prisma.professional.create({
      data: professional,
    });
  }

  async updateProfessional(professional: Professional): Promise<Professional> {
    return await this.prisma.professional.update({
      where: { id: professional.id },
      data: professional,
    });
  }

  async deleteProfessional(id: string): Promise<void> {
    await this.prisma.professional.delete({
      where: {
        id,
      },
    });
  }
}
