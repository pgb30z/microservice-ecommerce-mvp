import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class UpdateInventory {
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

    const existingProduct =
      await this.productRepository.findByPid(
        pid
      );

    if (!existingProduct) {
      throw new Error(
        "Product not found"
      );
    }

    const product =
      await this.productRepository.decreaseInventory(
        pid,
        qty
      );

    if (!product) {
      return {
        success: false,
        message: "Insufficient inventory",
        pid: existingProduct.pid,
        price: existingProduct.price,
        quantity: existingProduct.quantity,
      };
    }

    return {
      success: true,
      message: "Inventory updated successfully",
      pid: product.pid,
      price: product.price,
      quantity: product.quantity,
    };
  }
}