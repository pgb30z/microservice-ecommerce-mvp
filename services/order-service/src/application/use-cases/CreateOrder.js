import { OrderRepository } from "../../infrastructure/repositories/OrderRepository.js";

export class CreateOrder {
  constructor() {
    this.orderRepository =
      new OrderRepository();
  }

  async execute({
    uid,
    discount = 0,
    items,
  }) {
    uid = Number(uid);
    discount = Number(discount);

    if (!uid) {
      throw new Error(
        "User ID is required"
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "Order must contain at least one item"
      );
    }

    for (const item of items) {
      if (
        !item.pid ||
        Number(item.qty) <= 0 ||
        Number(item.unit_price) < 0
      ) {
        throw new Error(
          "Invalid order item"
        );
      }
    }

    const subtotal = items.reduce(
      (sum, item) => {
        return (
          sum +
          Number(item.unit_price) *
            Number(item.qty)
        );
      },
      0
    );

    const discountAmount =
      subtotal * (discount / 100);

    const totalAmount =
      subtotal - discountAmount;

    return this.orderRepository.create({
      uid,
      discount,
      totalAmount,
      items,
    });
  }
}