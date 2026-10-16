import { Product } from "../../domain/entities/Product.js";

export class ProductRepository {
  async findAll() {
    return Product.find().sort({ pid: 1 });
  }

  async findByPid(pid) {
    return Product.findOne({
      pid: Number(pid),
    });
  }

  async create({
    pid,
    pname,
    price,
    quantity,
  }) {
    return Product.create({
      pid,
      pname,
      price,
      quantity,
    });
  }

  async update({
    pid,
    pname,
    price,
    quantity,
  }) {
    return Product.findOneAndUpdate(
      {
        pid: Number(pid),
      },
      {
        pname,
        price,
        quantity,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(pid) {
    return Product.findOneAndDelete({
      pid: Number(pid),
    });
  }
async checkInventory(pid, qty) {
  const product = await Product.findOne({
    pid: Number(pid),
  });

  if (!product) {
    return null;
  }

  return {
    product,
    available:
      product.quantity >= Number(qty),
  };
}

async decreaseInventory(pid, qty) {
  return Product.findOneAndUpdate(
    {
      pid: Number(pid),

      // Chỉ trừ nếu tồn kho còn đủ.
      quantity: {
        $gte: Number(qty),
      },
    },
    {
      $inc: {
        quantity: -Number(qty),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
}