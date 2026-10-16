import { OrderRepository } from "../../infrastructure/repositories/OrderRepository.js";

export class GetOrdersByUser {
  constructor() {
    this.orderRepository =
      new OrderRepository();
  }

  async execute(uid) {
    return this.orderRepository.findByUid(
      uid
    );
  }
}