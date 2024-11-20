import { Express, Router } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import PaymentService from "../services/PaymentService";

export default class PaymentController {
  private paymentService: PaymentService;
  private router: Router;

  constructor(server: Express) {
    this.paymentService = new PaymentService();
    this.router = Router();

    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
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
    });

    this.router.post("/new", async (request, response) => {
      try {
        const payment = await this.paymentService.createPayment(request.body);
        response.status(200).send(payment);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating payment.");
      }
    });

    this.router.delete(
      "/delete/:id",

      async (request, response) => {
        try {
          await this.paymentService.deletePayment(request.params.id);
          response.status(200).send("Payment successfully deleted.");
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while deleting payment.");
        }
      }
    );

    server.use("/payments", this.router);
  }
}
