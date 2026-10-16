import mongoose from "mongoose";

const shipmentSchema =
  new mongoose.Schema(
    {
      shipid: {
        type: Number,
        required: true,
        unique: true,
      },

      oid: {
        type: Number,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        required: true,
        default: "RECEIVED",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export const Shipment =
  mongoose.model(
    "Shipment",
    shipmentSchema
  );