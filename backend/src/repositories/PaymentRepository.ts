import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Payment from "../types/payment";

export default class PaymentRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getPaymentsByScheduleId(scheduleId: string): Promise<Payment[]> {
    return await this.prisma.payment.findMany({
      where: {
        scheduleId,
      },
    });
  }

  async createPayment(payment: Payment): Promise<Payment> {
    return await this.prisma.payment.create({
      data: payment,
    });
  }

  async updatePayment(payment: Payment): Promise<Payment> {
    return await this.prisma.payment.update({
      where: { id: payment.id },
      data: payment,
    });
  }

  async deletePayment(id: string): Promise<void> {
    await this.prisma.payment.delete({
      where: {
        id,
      },
    });
  }
}
