import { Express, Router, Request, Response, NextFunction } from "express";
import CustomerRepository from "../repositories/CustomerRepository";
import AuthGuard from "../middlewares/AuthGuard";

export default class CustomerController {
  private customerRepository: CustomerRepository;
  private router: Router;

  constructor(server: Express) {
    this.customerRepository = new CustomerRepository();
    this.router = Router();
    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const customers = await this.customerRepository.getAllCustomers();
        response.status(200).send(customers);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting customers.");
      }
    });

    this.router.get("/:id", async (request, response) => {
      try {
        const customer = await this.customerRepository.getCustomerById(
          request.params.id
        );
        response.status(200).send(customer);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting customer.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const customer = await this.customerRepository.createCustomer(
          request.body
        );
        response.status(200).send(customer);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating customer.");
      }
    });

    this.router.delete(
      "/update",

      async (request, response) => {
        try {
          const customer = await this.customerRepository.updateCustomer(
            request.body
          );
          response.status(200).send(customer);
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while updating customer.");
        }
      }
    );

    this.router.delete(
      "/delete/:id",

      async (request, response) => {
        try {
          await this.customerRepository.deleteCustomer(request.params.id);
          response.status(200).send("Customer successfully deleted.");
        } catch (error: any) {
          console.log(error);
          response.status(500).send("Error while deleting customer.");
        }
      }
    );

    server.use("/customers", this.router);
  }
}
