import { CreateOrder } from "./CreateOrder.js";

import {
  getMembershipScore,
} from "../../infrastructure/grpc/customerClient.js";

import {
  checkInventory,
  updateInventory,
} from "../../infrastructure/grpc/productClient.js";

import {
  getDiscountPercent,
} from "../../domain/services/DiscountPolicy.js";

export class PlaceOrder {
  constructor() {
    this.createOrder =
      new CreateOrder();
  }

  async execute({
    uid,
    items,
  }) {
    uid = Number(uid);

    /*
      1. Validate User
    */

    if (!uid) {
      throw new Error(
        "User ID is required"
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "Order must contain at least one item"
      );
    }

    /*
      2. Gom sản phẩm trùng PID

      Ví dụ:
      pid 1 qty 1
      pid 1 qty 2

      =>
      pid 1 qty 3
    */

    const itemMap =
      new Map();

    for (const item of items) {
      const pid =
        Number(item.pid);

      const qty =
        Number(item.qty);

      if (
        !pid ||
        qty <= 0
      ) {
        throw new Error(
          "Invalid order item"
        );
      }

      const currentQty =
        itemMap.get(pid) || 0;

      itemMap.set(
        pid,
        currentQty + qty
      );
    }

    const normalizedItems =
      Array.from(
        itemMap.entries()
      ).map(
        ([pid, qty]) => ({
          pid,
          qty,
        })
      );

    /*
      3. Lấy Membership/Score
         từ Customer Service
    */

    const membership =
      await getMembershipScore(
        uid
      );

    /*
      4. Xác định discount
    */

    const discount =
      getDiscountPercent(
        membership
      );

    /*
      5. Kiểm tra Product
         + lấy giá thật
    */

    const pricedItems = [];

    for (
      const item
      of normalizedItems
    ) {
      const inventory =
        await checkInventory(
          item.pid,
          item.qty
        );

      if (!inventory.success) {
        throw new Error(
          `Product ${item.pid}: ${inventory.message}`
        );
      }

      pricedItems.push({
        pid: item.pid,
        qty: item.qty,

        // Giá lấy trực tiếp
        // từ Product Service.
        unit_price:
          Number(
            inventory.price
          ),
      });
    }

    /*
      6. Tạo Order
         + OrderDetail
    */

    const order =
      await this.createOrder.execute({
        uid,
        discount,
        items: pricedItems,
      });

    /*
      7. Sau khi Order tạo thành công,
         cập nhật tồn kho
    */

    const inventoryUpdates = [];

    for (
      const item
      of normalizedItems
    ) {
      const result =
        await updateInventory(
          item.pid,
          item.qty
        );

      if (!result.success) {
        throw new Error(
          `Order ${order.oid} was created but inventory update failed for product ${item.pid}: ${result.message}`
        );
      }

      inventoryUpdates.push(
        result
      );
    }

    return {
      success: true,
      membership,
      order,
      inventoryUpdates,
    };
  }
}