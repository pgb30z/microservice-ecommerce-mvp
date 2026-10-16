import { CustomerRepository } from "../../infrastructure/repositories/CustomerRepository.js";

export class UpdateCustomer {
  constructor() {
    this.customerRepository =
      new CustomerRepository();
  }

  async execute({ uid, fullname }) {
    if (!fullname) {
      throw new Error(
        "Fullname is required"
      );
    }

    const customer =
      await this.customerRepository.findByUid(
        Number(uid)
      );

    if (!customer) {
      throw new Error(
        "Customer not found"
      );
    }

    return this.customerRepository.update({
      uid: Number(uid),
      fullname,
    });
  }
}