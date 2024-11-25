import { PrismaClient } from "@prisma/client";
import { Prisma } from "../prisma/PrismaClient";
import Customer from "../types/customer";
import CustomersData from "../types/customers-data";

export default class CustomerRepository {
  private prisma: PrismaClient = Prisma.getInstance();

  async getCustomers(
    page: number,
    pageSize: number,
    name?: string
  ): Promise<CustomersData> {
    const totalCustomers = await this.prisma.customer.count({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    const customers = await this.prisma.customer.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    return {
      totalCustomers,
      customers,
    };
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
