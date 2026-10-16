import grpc from "@grpc/grpc-js";

import { GetProducts } from "../../application/use-cases/GetProducts.js";
import { GetProduct } from "../../application/use-cases/GetProduct.js";
import { CreateProduct } from "../../application/use-cases/CreateProduct.js";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct.js";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct.js";
import { CheckInventory } from "../../application/use-cases/CheckInventory.js";
import { UpdateInventory } from "../../application/use-cases/UpdateInventory.js";

const getProducts = new GetProducts();
const getProduct = new GetProduct();
const createProduct = new CreateProduct();
const updateProduct = new UpdateProduct();
const deleteProduct = new DeleteProduct();
const checkInventory = new CheckInventory();
const updateInventory = new UpdateInventory();

function mapProduct(product) {
  return {
    pid: product.pid,
    pname: product.pname,
    price: product.price,
    quantity: product.quantity,
  };
}

export const productGrpcHandler = {

  getProducts: async (call, callback) => {
    try {
      const products =
        await getProducts.execute();

      callback(null, {
        products: products.map(mapProduct),
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  getProduct: async (call, callback) => {
    try {
      const product =
        await getProduct.execute(
          call.request.pid
        );

      callback(
        null,
        mapProduct(product)
      );
    } catch (error) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: error.message,
      });
    }
  },

  createProduct: async (call, callback) => {
  try {
    console.log(
      "Product gRPC received:",
      call.request
    );

    const product =
      await createProduct.execute({
        pid: call.request.pid,
        pname: call.request.pname,
        price: call.request.price,
        quantity: call.request.quantity,
      });

    callback(null, mapProduct(product));
  } catch (error) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: error.message,
    });
  }
},

  updateProduct: async (call, callback) => {
    try {
      const product =
        await updateProduct.execute({
          pid: call.request.pid,
          pname: call.request.pname,
          price: call.request.price,
          quantity: call.request.quantity,
        });

      callback(
        null,
        mapProduct(product)
      );
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },

  deleteProduct: async (call, callback) => {
    try {
      const result =
        await deleteProduct.execute(
          call.request.pid
        );

      callback(null, result);
    } catch (error) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: error.message,
      });
    }
  },

  checkInventory: async (call, callback) => {
    try {
      const result =
        await checkInventory.execute({
          pid: call.request.pid,
          qty: call.request.qty,
        });

      callback(null, result);
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },

  updateInventory: async (call, callback) => {
    try {
      const result =
        await updateInventory.execute({
          pid: call.request.pid,
          qty: call.request.qty,
        });

      callback(null, result);
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },
};