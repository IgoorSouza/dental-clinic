import { PaymentMethod } from "@prisma/client";

type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  scheduleId: string;
};

export default Payment;
