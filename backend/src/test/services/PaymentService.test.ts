import PaymentService from "../../services/PaymentService";
import PaymentRepository from "../../repositories/PaymentRepository";
import Payment from "../../interfaces/payment";
import { PaymentMethod } from "@prisma/client";

jest.mock("../../repositories/PaymentRepository");

const MockPaymentRepository = PaymentRepository as jest.MockedClass<
  typeof PaymentRepository
>;

describe("PaymentService", () => {
  const paymentService: PaymentService = new PaymentService();

  it("Should get payments by scheduleId", async () => {
    const mockPayments: Payment[] = [
      {
        id: "1",
        amount: 100,
        method: PaymentMethod.CREDIT,
        date: "2025-01-05T10:00:00Z",
        scheduleId: "1",
      },
    ];

    MockPaymentRepository.prototype.getPaymentsByScheduleId.mockResolvedValue(
      mockPayments
    );

    const payments = await paymentService.getPaymentsByScheduleId("1");

    expect(payments).toEqual(mockPayments);
    expect(
      MockPaymentRepository.prototype.getPaymentsByScheduleId
    ).toHaveBeenCalledWith("1");
  });

  it("Should create payment", async () => {
    const mockPayment: Payment = {
      amount: 100,
      method: PaymentMethod.CREDIT,
      date: "2025-01-01T10:00:00Z",
      scheduleId: "1",
    };
    const expectedPayment: Payment = { ...mockPayment, id: "1" };

    MockPaymentRepository.prototype.createPayment.mockResolvedValue(
      expectedPayment
    );

    const payment = await paymentService.createPayment(mockPayment);

    expect(payment).toEqual(expectedPayment);
    expect(MockPaymentRepository.prototype.createPayment).toHaveBeenCalledWith(
      mockPayment
    );
  });

  it("Should throw error when creating payment", async () => {
    const mockPayment: Payment = {
      amount: 100,
      method: PaymentMethod.CREDIT,
      date: "2025-01-01T10:00:00Z",
      scheduleId: "1",
    };

    MockPaymentRepository.prototype.createPayment.mockRejectedValue(
      new Error("Error creating payment")
    );

    await expect(paymentService.createPayment(mockPayment)).rejects.toThrow(
      "Error creating payment"
    );
  });

  it("Should update payment", async () => {
    const mockPayment: Payment = {
      id: "1",
      amount: 150.0,
      method: PaymentMethod.DEBIT,
      date: "2025-01-02T10:00:00Z",
      scheduleId: "1",
    };

    MockPaymentRepository.prototype.updatePayment.mockResolvedValue(
      mockPayment
    );

    const payment = await paymentService.updatePayment(mockPayment);

    expect(payment).toEqual(mockPayment);
    expect(MockPaymentRepository.prototype.updatePayment).toHaveBeenCalledWith(
      mockPayment
    );
  });

  it("Should throw error when updating payment", async () => {
    const mockPayment: Payment = {
      id: "1",
      amount: 150.0,
      method: PaymentMethod.DEBIT,
      date: "2025-01-02T10:00:00Z",
      scheduleId: "1",
    };

    MockPaymentRepository.prototype.updatePayment.mockRejectedValue(
      new Error("Error updating payment")
    );

    await expect(paymentService.updatePayment(mockPayment)).rejects.toThrow(
      "Error updating payment"
    );
    expect(MockPaymentRepository.prototype.updatePayment).toHaveBeenCalledWith(
      mockPayment
    );
  });

  it("Should delete payment", async () => {
    MockPaymentRepository.prototype.deletePayment.mockResolvedValue();

    await paymentService.deletePayment("1");

    expect(MockPaymentRepository.prototype.deletePayment).toHaveBeenCalledWith(
      "1"
    );
  });

  it("Should throw error when deleting payment", async () => {
    MockPaymentRepository.prototype.deletePayment.mockRejectedValue(
      new Error("Error deleting payment")
    );

    await expect(paymentService.deletePayment("1")).rejects.toThrow(
      "Error deleting payment"
    );
  });
});
