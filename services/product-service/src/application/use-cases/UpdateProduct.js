import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class UpdateProduct {
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
    const product =
      await this.productRepository.findByPid(pid);

    if (!product) {
      throw new Error("Product not found");
    }

    if (price < 0 || quantity < 0) {
      throw new Error(
        "Price and quantity must be non-negative"
      );
    }

    return this.productRepository.update({
      pid: Number(pid),
      pname,
      price: Number(price),
      quantity: Number(quantity),
    });
  }
}