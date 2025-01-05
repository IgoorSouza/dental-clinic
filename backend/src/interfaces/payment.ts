import { PaymentMethod } from "@prisma/client";

export default interface Payment {
  id?: string;
  amount: number;
  method: PaymentMethod;
  date: Date | string;
  scheduleId: string;
}
