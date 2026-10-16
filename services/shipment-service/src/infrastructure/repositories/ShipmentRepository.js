import {
  Shipment,
} from "../../domain/entities/Shipment.js";

import {
  ShipmentCounter,
} from "../database/ShipmentCounter.js";

export class ShipmentRepository {

  async getNextShipId() {
    const counter =
      await ShipmentCounter.findOneAndUpdate(
        {
          _id: "shipmentId",
        },

        {
          $inc: {
            seq: 1,
          },
        },

        {
          new: true,
          upsert: true,
        }
      );

    return counter.seq;
  }

  async findByOrderId(oid) {
    return Shipment.findOne({
      oid: Number(oid),
    });
  }

  async findByShipId(shipid) {
    return Shipment.findOne({
      shipid: Number(shipid),
    });
  }

  async createForOrder(oid) {

    oid = Number(oid);

    /*
      Kafka có thể gửi lại cùng một event.

      Nếu shipment của Order đã tồn tại
      thì không tạo shipment thứ hai.
    */

    const existing =
      await this.findByOrderId(oid);

    if (existing) {
      return existing;
    }

    const shipid =
      await this.getNextShipId();

    try {
      return await Shipment.create({
        shipid,
        oid,
        status: "RECEIVED",
      });

    } catch (error) {

      /*
        Chống duplicate nếu hai message
        cùng lúc xử lý một Order.
      */

      if (error.code === 11000) {
        return this.findByOrderId(
          oid
        );
      }

      throw error;
    }
  }

  async updateStatus(
    shipid,
    status
  ) {
    return Shipment.findOneAndUpdate(
      {
        shipid:
          Number(shipid),
      },

      {
        status,
      },

      {
        new: true,
        runValidators: true,
      }
    );
  }
}