import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Payment from "../types/payment";

export default class PaymentRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getAllPayments() {
    return await this.prisma.payment.findMany();
  }

  async getPaymentById(id: string) {
    return await this.prisma.payment.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createPayment(payment: Payment) {
    return await this.prisma.payment.create({
      data: payment,
    });
  }

  async updatePayment(payment: Payment) {
    return await this.prisma.payment.update({
      where: { id: payment.id },
      data: payment,
    });
  }

  async deletePayment(id: string) {
    return await this.prisma.payment.delete({
      where: {
        id,
      },
    });
  }
}
