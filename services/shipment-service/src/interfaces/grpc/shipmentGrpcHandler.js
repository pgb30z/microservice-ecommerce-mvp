import grpc from "@grpc/grpc-js";

import {
  GetShipment,
} from "../../application/use-cases/GetShipment.js";

import {
  GetShipmentByOrder,
} from "../../application/use-cases/GetShipmentByOrder.js";

import {
  UpdateShipmentStatus,
} from "../../application/use-cases/UpdateShipmentStatus.js";

const getShipment =
  new GetShipment();

const getShipmentByOrder =
  new GetShipmentByOrder();

const updateShipmentStatus =
  new UpdateShipmentStatus();

function mapShipment(
  shipment,
  message
) {
  return {
    success: true,
    message,

    shipid:
      Number(
        shipment.shipid
      ),

    oid:
      Number(
        shipment.oid
      ),

    status:
      shipment.status,
  };
}

export const shipmentGrpcHandler = {

  getShipment: async (
    call,
    callback
  ) => {
    try {
      const shipment =
        await getShipment.execute(
          call.request.shipid
        );

      callback(
        null,
        mapShipment(
          shipment,
          "Shipment retrieved successfully"
        )
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

  getShipmentByOrder: async (
    call,
    callback
  ) => {
    try {
      const shipment =
        await getShipmentByOrder
          .execute(
            call.request.oid
          );

      callback(
        null,
        mapShipment(
          shipment,
          "Shipment retrieved successfully"
        )
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

  updateShipmentStatus: async (
    call,
    callback
  ) => {
    try {
      const shipment =
        await updateShipmentStatus
          .execute({
            shipid:
              call.request.shipid,

            status:
              call.request.status,
          });

      callback(
        null,
        mapShipment(
          shipment,
          "Shipment status updated successfully"
        )
      );

    } catch (error) {
      callback({
        code:
          grpc.status.INVALID_ARGUMENT,

        message:
          error.message,
      });
    }
  },
};