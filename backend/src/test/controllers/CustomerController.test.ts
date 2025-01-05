import request from "supertest";
import express, { Express } from "express";
import CustomerController from "../../controllers/CustomerController";
import CustomerService from "../../services/CustomerService";
import Customer from "../../interfaces/customer";
import CustomersData from "../../interfaces/customers-data";

jest.mock("../../services/CustomerService");
jest.mock("../../middlewares/AuthGuard", () => ({
  verifyAuthencation: jest.fn((req, res, next) => next()),
}));

const MockCustomerService = CustomerService as jest.MockedClass<
  typeof CustomerService
>;

describe("CustomerController", () => {
  const app: Express = express();
  app.use(express.json());
  new CustomerController(app);

  it("Should return page of customers", async () => {
    const mockCustomers: CustomersData = {
      totalCustomers: 2,
      customers: [
        { id: "1", name: "Igor Souza de Castro", phone: "123456789" },
        { id: "2", name: "Pedro Henrique Lopes", phone: "987654321" },
      ],
    };

    MockCustomerService.prototype.getCustomers.mockResolvedValue(mockCustomers);

    const response = await request(app)
      .get("/customers")
      .query({ page: 1, pageSize: 10, name: undefined });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomers);
    expect(MockCustomerService.prototype.getCustomers).toHaveBeenCalledWith(
      "1",
      "10",
      undefined
    );
  });

  it("Should return error when getting customers", async () => {
    MockCustomerService.prototype.getCustomers.mockRejectedValue(
      new Error("Error while getting customers.")
    );

    const response = await request(app)
      .get("/customers")
      .query({ page: 1, pageSize: 10 });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while getting customers.");
  });

  it("Should create customer", async () => {
    const mockCustomer: Customer = {
      id: "1",
      name: "Igor Souza de Castro",
      phone: "123456789",
      birthDate: "2025-01-05T10:00:00Z",
      email: "igor.castro@estudante.iftm.edu.br",
      description: "Cliente 1",
    };

    MockCustomerService.prototype.createCustomer.mockResolvedValue(
      mockCustomer
    );

    const response = await request(app).post("/customers/new").send({
      name: "Igor Souza de Castro",
      phone: "123456789",
      email: "igor.castro@estudante.iftm.edu.br",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomer);
    expect(MockCustomerService.prototype.createCustomer).toHaveBeenCalledWith({
      name: "Igor Souza de Castro",
      phone: "123456789",
      email: "igor.castro@estudante.iftm.edu.br",
    });
  });

  it("Should handle error when creating a customer", async () => {
    MockCustomerService.prototype.createCustomer.mockRejectedValue(
      new Error("Error while creating customer.")
    );

    const response = await request(app)
      .post("/customers/new")
      .send({ name: "", phone: "" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while creating customer.");
  });

  it("Should update customer", async () => {
    const mockCustomer: Customer = {
      id: "1",
      name: "Igor Souza",
      phone: "123454321",
      birthDate: "2025-01-05T10:00:00Z",
      email: "igor.souza@estudante.iftm.edu.br",
      description: "Cliente 1",
    };

    MockCustomerService.prototype.updateCustomer.mockResolvedValue(
      mockCustomer
    );

    const response = await request(app)
      .put("/customers/update")
      .send({ id: "1", name: "Igor Souza", phone: "123454321" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomer);
    expect(MockCustomerService.prototype.updateCustomer).toHaveBeenCalledWith({
      id: "1",
      name: "Igor Souza",
      phone: "123454321",
    });
  });

  it("Should return error when updating a customer", async () => {
    MockCustomerService.prototype.updateCustomer.mockRejectedValue(
      new Error("Error while updating customer.")
    );

    const response = await request(app)
      .put("/customers/update")
      .send({ id: "", name: "" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while updating customer.");
  });

  it("Should delete customer", async () => {
    MockCustomerService.prototype.deleteCustomer.mockResolvedValue();

    const response = await request(app).delete("/customers/delete/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Customer successfully deleted.");
    expect(MockCustomerService.prototype.deleteCustomer).toHaveBeenCalledWith(
      "1"
    );
  });

  it("Should return error when deleting a customer", async () => {
    MockCustomerService.prototype.deleteCustomer.mockRejectedValue(
      new Error("Error while deleting customer.")
    );

    const response = await request(app).delete("/customers/delete/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while deleting customer.");
  });
});
