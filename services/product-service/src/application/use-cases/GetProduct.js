import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class GetProduct {
  constructor() {
    this.productRepository =
      new ProductRepository();
  }

  async execute(pid) {
    const product =
      await this.productRepository.findByPid(pid);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}