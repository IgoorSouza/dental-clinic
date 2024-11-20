import { Express, Router } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import CustomerService from "../services/CustomerService";

export default class CustomerController {
  private customerService: CustomerService;
  private router: Router;

  constructor(server: Express) {
    this.customerService = new CustomerService();
    this.router = Router();

    this.router.use(AuthGuard.verifyAuthencation);

    this.router.get("/", async (request, response) => {
      try {
        const customers = await this.customerService.getCustomers();
        response.status(200).send(customers);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while getting customers.");
      }
    });

    this.router.post("/new", async (request, response) => {
      try {
        const customer = await this.customerService.createCustomer(
          request.body
        );
        response.status(200).send(customer);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while creating customer.");
      }
    });

    this.router.put("/update", async (request, response) => {
      try {
        const customer = await this.customerService.updateCustomer(
          request.body
        );
        response.status(200).send(customer);
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while updating customer.");
      }
    });

    this.router.delete("/delete/:id", async (request, response) => {
      try {
        await this.customerService.deleteCustomer(request.params.id);
        response.status(200).send("Customer successfully deleted.");
      } catch (error: any) {
        console.log(error);
        response.status(500).send("Error while deleting customer.");
      }
    });

    server.use("/customers", this.router);
  }
}
