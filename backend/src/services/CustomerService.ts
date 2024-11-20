import CustomerRepository from "../repositories/CustomerRepository";
import Customer from "../types/customer";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomers(): Promise<Customer[]> {
    return await this.customerRepository.getCustomers();
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    return await this.customerRepository.createCustomer(customer);
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    return await this.customerRepository.updateCustomer(customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.deleteCustomer(id);
  }
}
