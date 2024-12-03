import { Express, Router, Request, Response } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import PaymentService from "../services/PaymentService";

export default class PaymentController {
  private paymentService: PaymentService;

  constructor(server: Express) {
    this.paymentService = new PaymentService();
    const router = Router();

    router.use(AuthGuard.verifyAuthencation);
    router.get("/", this.getPaymentsByScheduleId.bind(this));
    router.post("/new", this.createPayment.bind(this));
    router.delete("/delete/:id", this.deletePayment.bind(this));

    server.use("/payments", router);
  }

  private async getPaymentsByScheduleId(request: Request, response: Response) {
    try {
      const { scheduleId } = request.query;
      const payments = await this.paymentService.getPaymentsByScheduleId(
        scheduleId as string
      );
      response.status(200).send(payments);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while getting payments.");
    }
  }

  private async createPayment(request: Request, response: Response) {
    try {
      const payment = await this.paymentService.createPayment(request.body);
      response.status(200).send(payment);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while creating payment.");
    }
  }

  private async deletePayment(request: Request, response: Response) {
    try {
      await this.paymentService.deletePayment(request.params.id);
      response.status(200).send("Payment successfully deleted.");
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while deleting payment.");
    }
  }
}
