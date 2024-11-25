import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Schedule from "../types/schedule";

export default class ScheduleRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getSchedulesByProfessional(
    professionalId: string
  ): Promise<Schedule[]> {
    return await this.prisma.schedule.findMany({
      where: {
        professionalId,
      },
    });
  }

  async getSchedulesByProfessionalAndDate(
    professionalId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Schedule[]> {
    return await this.prisma.schedule.findMany({
      where: {
        professionalId,
        AND: [
          {
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });
  }

  async getSchedulesByCustomerAndDate(
    customerId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Schedule[]> {
    return await this.prisma.schedule.findMany({
      where: {
        customerId,
        AND: [
          {
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });
  }

  async createSchedule(schedule: Schedule): Promise<Schedule> {
    return await this.prisma.schedule.create({
      data: schedule,
    });
  }

  async updateSchedule(schedule: Schedule): Promise<Schedule> {
    return await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: schedule,
    });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.prisma.schedule.delete({
      where: {
        id,
      },
    });
  }
}
