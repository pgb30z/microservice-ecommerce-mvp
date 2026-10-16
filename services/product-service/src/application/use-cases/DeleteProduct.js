import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class DeleteProduct {
  constructor() {
    this.productRepository =
      new ProductRepository();
  }

  async execute(pid) {
    const product =
      await this.productRepository.delete(pid);

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      message: "Product deleted successfully",
    };
  }
}