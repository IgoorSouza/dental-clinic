import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Customer from "../types/customer";

export default class CustomerRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getCustomers(): Promise<Customer[]> {
    return await this.prisma.customer.findMany();
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    return await this.prisma.customer.create({
      data: customer,
    });
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    return await this.prisma.customer.update({
      where: { id: customer.id },
      data: customer,
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
