import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Customer from "../types/customer";

export default class CustomerRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getAllCustomers() {
    return await this.prisma.customer.findMany();
  }

  async getCustomerById(id: string) {
    return await this.prisma.customer.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createCustomer(customer: Customer) {
    return await this.prisma.customer.create({
      data: customer,
    });
  }

  async updateCustomer(customer: Customer) {
    return await this.prisma.customer.update({
      where: { id: customer.id },
      data: customer,
    });
  }

  async deleteCustomer(id: string) {
    return await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
