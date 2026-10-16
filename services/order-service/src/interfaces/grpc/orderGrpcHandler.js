import grpc from "@grpc/grpc-js";

import { PlaceOrder } from "../../application/use-cases/PlaceOrder.js";
import { GetOrder } from "../../application/use-cases/GetOrder.js";
import { GetOrdersByUser } from "../../application/use-cases/GetOrdersByUser.js";

const placeOrder =
  new PlaceOrder();

const getOrder =
  new GetOrder();

const getOrdersByUser =
  new GetOrdersByUser();

/*
  Prisma Decimal
       ↓
  Number dùng cho gRPC
*/
function mapOrder(order) {
  return {
    success: true,

    message:
      "Order retrieved successfully",

    oid: Number(order.oid),

    uid: Number(order.uid),

    discount:
      Number(order.discount),

    total_amount:
      Number(order.total_amount),

    created_at:
      order.created_at
        ? order.created_at.toISOString()
        : "",

    items:
      order.details.map(
        (detail) => ({
          pid:
            Number(detail.pid),

          qty:
            Number(detail.qty),

          unit_price:
            Number(
              detail.unit_price
            ),
        })
      ),
  };
}

export const orderGrpcHandler = {

  /* =====================
     CREATE ORDER
  ===================== */

  createOrder: async (
    call,
    callback
  ) => {
    try {
      console.log(
        "CreateOrder received:",
        call.request
      );

      const result =
        await placeOrder.execute({
          uid:
            call.request.uid,

          items:
            call.request.items,
        });

      const response =
        mapOrder(
          result.order
        );

      response.message =
        "Order created successfully";

      callback(
        null,
        response
      );

    } catch (error) {
      console.error(
        "CreateOrder error:",
        error.message
      );

      callback({
        code:
          grpc.status.INVALID_ARGUMENT,

        message:
          error.message,
      });
    }
  },

  /* =====================
     GET ORDER
  ===================== */

  getOrder: async (
    call,
    callback
  ) => {
    try {
      const order =
        await getOrder.execute(
          call.request.oid
        );

      callback(
        null,
        mapOrder(order)
      );

    } catch (error) {
      callback({
        code:
          grpc.status.NOT_FOUND,

        message:
          error.message,
      });
    }
  },

  /* =====================
     GET ORDERS BY USER
  ===================== */

  getOrdersByUser: async (
    call,
    callback
  ) => {
    try {
      const orders =
        await getOrdersByUser.execute(
          call.request.uid
        );

      callback(
        null,
        {
          orders:
            orders.map(
              mapOrder
            ),
        }
      );

    } catch (error) {
      callback({
        code:
          grpc.status.INTERNAL,

        message:
          error.message,
      });
    }
  },
};