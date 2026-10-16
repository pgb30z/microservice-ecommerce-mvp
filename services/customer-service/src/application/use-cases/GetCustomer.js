import { CustomerRepository } from "../../infrastructure/repositories/CustomerRepository.js";

export class GetCustomer {
  constructor() {
    this.customerRepository =
      new CustomerRepository();
  }

  async execute(uid) {
    const customer =
      await this.customerRepository.findByUid(
        Number(uid)
      );

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}