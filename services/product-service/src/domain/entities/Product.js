import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
    {
      pid: {
        type: Number,
        required: true,
        unique: true,
      },

      pname: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export const Product =
  mongoose.model(
    "Product",
    productSchema
  );