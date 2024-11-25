import CustomerRepository from "../repositories/CustomerRepository";
import Customer from "../types/customer";
import CustomersData from "../types/customers-data";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomers(page: string, pageSize: string, name?: string): Promise<CustomersData> {
    return await this.customerRepository.getCustomers(Number(page), Number(pageSize), name);
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
