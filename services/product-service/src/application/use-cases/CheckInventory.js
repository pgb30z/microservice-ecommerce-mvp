import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class CheckInventory {
  constructor() {
    this.productRepository =
      new ProductRepository();
  }

  async execute({ pid, qty }) {
    pid = Number(pid);
    qty = Number(qty);

    if (!pid || qty <= 0) {
      throw new Error(
        "Product ID and quantity are invalid"
      );
    }

    const result =
      await this.productRepository.checkInventory(
        pid,
        qty
      );

    if (!result) {
      throw new Error(
        "Product not found"
      );
    }

    if (!result.available) {
      return {
        success: false,
        message: "Insufficient inventory",
        pid: result.product.pid,
        price: result.product.price,
        quantity: result.product.quantity,
      };
    }

    return {
      success: true,
      message: "Inventory available",
      pid: result.product.pid,
      price: result.product.price,
      quantity: result.product.quantity,
    };
  }
}