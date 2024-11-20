import PaymentMethod from "./payment-method";

export default interface Payment {
  id?: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  scheduleId: string;
}
