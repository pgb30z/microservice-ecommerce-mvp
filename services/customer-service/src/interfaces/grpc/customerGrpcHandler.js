import grpc from "@grpc/grpc-js";

import { CreateCustomer } from "../../application/use-cases/CreateCustomer.js";
import { GetCustomer } from "../../application/use-cases/GetCustomer.js";
import { GetMembershipScore } from "../../application/use-cases/GetMembershipScore.js";
import { UpdateCustomer } from "../../application/use-cases/UpdateCustomer.js";

const createCustomer =
  new CreateCustomer();

const getCustomer =
  new GetCustomer();

const getMembershipScore =
  new GetMembershipScore();

const updateCustomer =
  new UpdateCustomer();

function mapCustomer(customer) {
  return {
    uid: customer.uid,
    fullname: customer.fullname,
    mid: customer.mid,
    mname: customer.membership?.mname || "",
    score: customer.membership?.score || 0,
  };
}

export const customerGrpcHandler = {

  createCustomer: async (call, callback) => {
    try {
      const customer =
        await createCustomer.execute({
          uid: Number(call.request.uid),
          fullname: call.request.fullname,
        });

      callback(
        null,
        mapCustomer(customer)
      );
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },

  getCustomer: async (call, callback) => {
    try {
      const customer =
        await getCustomer.execute(
          call.request.uid
        );

      callback(
        null,
        mapCustomer(customer)
      );
    } catch (error) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: error.message,
      });
    }
  },

  getMembershipScore: async (
    call,
    callback
  ) => {
    try {
      const membership =
        await getMembershipScore.execute(
          call.request.uid
        );

      callback(null, membership);
    } catch (error) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: error.message,
      });
    }
  },

  updateCustomer: async (
    call,
    callback
  ) => {
    try {
      const customer =
        await updateCustomer.execute({
          uid: Number(call.request.uid),
          fullname: call.request.fullname,
        });

      callback(
        null,
        mapCustomer(customer)
      );
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },
};