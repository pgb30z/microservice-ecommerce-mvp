import { CustomerRepository } from "../../infrastructure/repositories/CustomerRepository.js";

export class CreateCustomer {

  constructor() {
    this.customerRepository =
      new CustomerRepository();
  }

  async execute({
    uid,
    fullname,
  }) {

    if (!uid) {
      throw new Error(
        "User ID is required"
      );
    }

    if (!fullname) {
      throw new Error(
        "Fullname is required"
      );
    }

    const existingCustomer =
      await this.customerRepository.findByUid(
        uid
      );

    if (existingCustomer) {
      throw new Error(
        "Customer already exists"
      );
    }

    const membership =
      await this.customerRepository.getDefaultMembership();

    if (!membership) {
      throw new Error(
        "Default membership not found"
      );
    }

    return this.customerRepository.create({
      uid,
      fullname,
      mid: membership.mid,
    });
  }
}