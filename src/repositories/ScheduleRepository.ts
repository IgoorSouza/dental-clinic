import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Schedule from "../types/schedule";

export default class ScheduleRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getAllSchedules() {
    return await this.prisma.schedule.findMany();
  }

  async getScheduleById(id: string) {
    return await this.prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createSchedule(schedule: Schedule) {
    return await this.prisma.schedule.create({
      data: schedule,
    });
  }

  async updateSchedule(schedule: Schedule) {
    return await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: schedule,
    });
  }

  async deleteSchedule(id: string) {
    return await this.prisma.schedule.delete({
      where: {
        id,
      },
    });
  }
}
