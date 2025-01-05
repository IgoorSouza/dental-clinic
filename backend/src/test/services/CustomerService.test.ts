import CustomerService from "../../services/CustomerService";
import CustomerRepository from "../../repositories/CustomerRepository";
import Customer from "../../interfaces/customer";
import CustomersData from "../../interfaces/customers-data";

jest.mock("../../repositories/CustomerRepository");

const MockCustomerRepository = CustomerRepository as jest.MockedClass<
  typeof CustomerRepository
>;

describe("CustomerService", () => {
  const customerService: CustomerService = new CustomerService();

  it("Should get all customers", async () => {
    const mockCustomersData: CustomersData = {
      totalCustomers: 2,
      customers: [
        { id: "1", name: "Igor Souza de Castro", phone: "1234567890" },
        { id: "2", name: "Pedro Henrique Lopes", phone: "0987654321" },
      ],
    };

    MockCustomerRepository.prototype.getCustomers.mockResolvedValue(
      mockCustomersData
    );

    const response = await customerService.getCustomers("1", "10");

    expect(response).toEqual(mockCustomersData);
    expect(MockCustomerRepository.prototype.getCustomers).toHaveBeenCalledWith(
      1,
      10,
      undefined
    );
  });

  it("Should get customers filtered by name", async () => {
    const mockCustomers: CustomersData = {
      totalCustomers: 1,
      customers: [
        { id: "1", name: "Igor Souza de Castro", phone: "1234567890" },
      ],
    };

    MockCustomerRepository.prototype.getCustomers.mockResolvedValue(
      mockCustomers
    );

    const response = await customerService.getCustomers("1", "10", "Igor");

    expect(response).toEqual(mockCustomers);
    expect(MockCustomerRepository.prototype.getCustomers).toHaveBeenCalledWith(
      1,
      10,
      "Igor"
    );
  });

  it("Should create customer", async () => {
    const mockCustomer: Customer = {
      name: "Igor Souza de Castro",
      phone: "1234567890",
      email: "igor.castro@estudante.iftm.edu.br",
    };
    const expectedCustomer: Customer = { ...mockCustomer, id: "1" };

    MockCustomerRepository.prototype.createCustomer.mockResolvedValue(
      expectedCustomer
    );

    const response = await customerService.createCustomer(mockCustomer);

    expect(response).toEqual(expectedCustomer);
    expect(
      MockCustomerRepository.prototype.createCustomer
    ).toHaveBeenCalledWith(mockCustomer);
  });

  it("Should throw error when creating customer", async () => {
    const mockCustomer: Customer = {
      name: "Igor Souza de Castro",
      phone: "1234567890",
      email: "igor.castro@estudante.iftm.edu.br",
    };

    MockCustomerRepository.prototype.createCustomer.mockRejectedValue(
      new Error("Error while creating customer.")
    );

    await expect(customerService.createCustomer(mockCustomer)).rejects.toThrow(
      "Error while creating customer."
    );
    expect(
      MockCustomerRepository.prototype.createCustomer
    ).toHaveBeenCalledWith(mockCustomer);
  });

  it("Should update customer", async () => {
    const mockCustomer: Customer = {
      name: "Igor Souza",
      phone: "1234567890",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockCustomerRepository.prototype.updateCustomer.mockResolvedValue(
      mockCustomer
    );

    const response = await customerService.updateCustomer(mockCustomer);

    expect(response).toEqual(mockCustomer);
    expect(
      MockCustomerRepository.prototype.updateCustomer
    ).toHaveBeenCalledWith(mockCustomer);
  });

  it("Should throw error when updating customer", async () => {
    const mockCustomer: Customer = {
      id: "1",
      name: "Igor Souza",
      phone: "1234567890",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockCustomerRepository.prototype.updateCustomer.mockRejectedValue(
      new Error("Error while updating customer.")
    );
    await expect(customerService.updateCustomer(mockCustomer)).rejects.toThrow(
      "Error while updating customer."
    );
  });

  it("Should delete customer", async () => {
    MockCustomerRepository.prototype.deleteCustomer.mockResolvedValue();

    await customerService.deleteCustomer("1");

    expect(
      MockCustomerRepository.prototype.deleteCustomer
    ).toHaveBeenCalledWith("1");
  });

  it("Should throw error when deleting customer", async () => {
    MockCustomerRepository.prototype.deleteCustomer.mockRejectedValue(
      new Error("Error while deleting customer.")
    );
    await expect(customerService.deleteCustomer("1")).rejects.toThrow(
      "Error while deleting customer."
    );
    expect(
      MockCustomerRepository.prototype.deleteCustomer
    ).toHaveBeenCalledWith("1");
  });
});
