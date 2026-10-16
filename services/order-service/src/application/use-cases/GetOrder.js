import { OrderRepository } from "../../infrastructure/repositories/OrderRepository.js";

export class GetOrder {
  constructor() {
    this.orderRepository =
      new OrderRepository();
  }

  async execute(oid) {
    const order =
      await this.orderRepository.findByOid(
        oid
      );

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    return order;
  }
}