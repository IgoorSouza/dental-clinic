import { Express, Router, Request, Response, NextFunction } from "express";
import PaymentRepository from "../repositories/PaymentRepository";
import AuthGuard from "../middlewares/AuthGuard";

export default class PaymentController {
  private paymentRepository: PaymentRepository;
  private router: Router;

  constructor(server: Express) {
    this.paymentRepository = new PaymentRepository();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const payments = await this.paymentRepository.getAllPayments();
        response.status(200).send(payments);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting payments.");
      }
    });

    this.router.get("/:id", async (request, response) => {
      try {
        const payment = await this.paymentRepository.getPaymentById(
          request.params.id
        );
        response.status(200).send(payment);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting payment.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const payment = await this.paymentRepository.createPayment(
          request.body
        );
        response.status(200).send(payment);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating payment.");
      }
    });

    this.router.put(
      "/update",

      async (request, response) => {
        try {
          const payment = await this.paymentRepository.updatePayment(
            request.body
          );
          response.status(200).send(payment);
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while updating payment.");
        }
      }
    );

    this.router.delete(
      "/delete/:id",

      async (request, response) => {
        try {
          await this.paymentRepository.deletePayment(request.params.id);
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
