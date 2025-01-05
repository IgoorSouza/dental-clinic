import request from "supertest";
import express, { Express } from "express";
import PaymentController from "../../controllers/PaymentController";
import PaymentService from "../../services/PaymentService";
import { PaymentMethod } from "@prisma/client";

jest.mock("../../services/PaymentService");
jest.mock("../../middlewares/AuthGuard", () => ({
  verifyAuthencation: jest.fn((req, res, next) => next()),
}));

const MockPaymentService = PaymentService as jest.MockedClass<
  typeof PaymentService
>;

describe("PaymentController", () => {
  const app: Express = express();
  app.use(express.json());
  new PaymentController(app);

  it("Should return payments according to schedule id", async () => {
    const mockPayments = [
      {
        id: "1",
        scheduleId: "1",
        amount: 100,
        method: PaymentMethod.CREDIT,
        date: "2025-01-05T10:00:00Z",
      },
      {
        id: "2",
        scheduleId: "1",
        amount: 150,
        method: PaymentMethod.PIX,
        date: "2025-01-06T11:00:00Z",
      },
    ];

    MockPaymentService.prototype.getPaymentsByScheduleId.mockResolvedValue(
      mockPayments
    );

    const response = await request(app)
      .get("/payments")
      .query({ scheduleId: "1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPayments);
    expect(
      MockPaymentService.prototype.getPaymentsByScheduleId
    ).toHaveBeenCalledWith("1");
  });

  it("Should return error when getting payments", async () => {
    MockPaymentService.prototype.getPaymentsByScheduleId.mockRejectedValue(
      new Error("Error while getting payments.")
    );

    const response = await request(app)
      .get("/payments")
      .query({ scheduleId: "1" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while getting payments.");
  });

  it("Should create payment", async () => {
    const mockPayment = {
      id: "1",
      scheduleId: "1",
      amount: 100,
      method: PaymentMethod.CASH,
      date: "2025-01-05T10:00:00Z",
    };

    MockPaymentService.prototype.createPayment.mockResolvedValue(mockPayment);

    const response = await request(app).post("/payments/new").send({
      scheduleId: "1",
      amount: 100,
      method: PaymentMethod.CASH,
      date: "2025-01-05T10:00:00Z",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPayment);
    expect(MockPaymentService.prototype.createPayment).toHaveBeenCalledWith({
      scheduleId: "1",
      amount: 100,
      method: PaymentMethod.CASH,
      date: "2025-01-05T10:00:00Z",
    });
  });

  it("Should return error when creating a payment", async () => {
    MockPaymentService.prototype.createPayment.mockRejectedValue(
      new Error("Error while creating payment.")
    );

    const response = await request(app).post("/payments/new").send({
      scheduleId: "1",
      amount: 100,
      method: PaymentMethod.CHECK,
      date: "2025-01-05T10:00:00Z",
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while creating payment.");
  });

  it("Should delete payment", async () => {
    MockPaymentService.prototype.deletePayment.mockResolvedValue();

    const response = await request(app).delete("/payments/delete/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Payment successfully deleted.");
    expect(MockPaymentService.prototype.deletePayment).toHaveBeenCalledWith(
      "1"
    );
  });

  it("Should return error when deleting a payment", async () => {
    MockPaymentService.prototype.deletePayment.mockRejectedValue(
      new Error("Error while deleting payment.")
    );

    const response = await request(app).delete("/payments/delete/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while deleting payment.");
  });
});
