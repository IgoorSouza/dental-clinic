import { PrismaClient } from "@prisma/client";

export class Prisma {
  private static client: PrismaClient;

  static getInstance(): PrismaClient {
    if (!this.client) this.client = new PrismaClient();
    return this.client;
  }
}