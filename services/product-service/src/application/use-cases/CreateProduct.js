import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class CreateProduct {
  constructor() {
    this.productRepository =
      new ProductRepository();
  }

  async execute({
    pid,
    pname,
    price,
    quantity,
  }) {
    if (!pid || !pname) {
      throw new Error(
        "Product ID and name are required"
      );
    }

    if (price < 0 || quantity < 0) {
      throw new Error(
        "Price and quantity must be non-negative"
      );
    }

    const existingProduct =
      await this.productRepository.findByPid(pid);

    if (existingProduct) {
      throw new Error(
        "Product ID already exists"
      );
    }

    return this.productRepository.create({
      pid: Number(pid),
      pname,
      price: Number(price),
      quantity: Number(quantity),
    });
  }
}