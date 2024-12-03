import { Express, Router, Request, Response } from "express";
import AuthGuard from "../middlewares/AuthGuard";
import CustomerService from "../services/CustomerService";

export default class CustomerController {
  private customerService: CustomerService;

  constructor(server: Express) {
    this.customerService = new CustomerService();
    const router = Router();

    router.use(AuthGuard.verifyAuthencation);
    router.get("/", this.getCustomers.bind(this));
    router.post("/new", this.createCustomer.bind(this));
    router.put("/update", this.updateCustomer.bind(this));
    router.delete("/delete/:id", this.deleteCustomer.bind(this));
    
    server.use("/customers", router);
  }

  private async getCustomers(request: Request, response: Response) {
    try {
      const { page, pageSize, name } = request.query;

      const customersData = await this.customerService.getCustomers(
        page as string,
        pageSize as string,
        name as string
      );
      response.status(200).send(customersData);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while getting customers.");
    }
  }

  private async createCustomer(request: Request, response: Response) {
    try {
      const customer = await this.customerService.createCustomer(request.body);
      response.status(200).send(customer);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while creating customer.");
    }
  }

  private async updateCustomer(request: Request, response: Response) {
    try {
      const customer = await this.customerService.updateCustomer(request.body);
      response.status(200).send(customer);
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while updating customer.");
    }
  }

  private async deleteCustomer(request: Request, response: Response) {
    try {
      await this.customerService.deleteCustomer(request.params.id);
      response.status(200).send("Customer successfully deleted.");
    } catch (error: any) {
      console.log(error);
      response.status(500).send("Error while deleting customer.");
    }
  }
}
