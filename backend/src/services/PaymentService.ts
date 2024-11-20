import PaymentRepository from "../repositories/PaymentRepository";
import Payment from "../types/payment";

export default class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async getPaymentsByScheduleId(scheduleId: string): Promise<Payment[]> {
    return await this.paymentRepository.getPaymentsByScheduleId(scheduleId);
  }

  async createPayment(payment: Payment): Promise<Payment> {
    return await this.paymentRepository.createPayment(payment);
  }

  async updatePayment(payment: Payment): Promise<Payment> {
    return await this.paymentRepository.updatePayment(payment);
  }

  async deletePayment(id: string): Promise<void> {
    await this.paymentRepository.deletePayment(id);
  }
}
