import { ProductRepository } from "../../infrastructure/repositories/ProductRepository.js";

export class GetProducts {
  constructor() {
    this.productRepository =
      new ProductRepository();
  }

  async execute() {
    return this.productRepository.findAll();
  }
}