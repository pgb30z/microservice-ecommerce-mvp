import prisma from "../database/prisma.js";

export class OrderRepository {
  async create({
  uid,
  discount,
  totalAmount,
  items,
}) {
  return prisma.$transaction(async (tx) => {

    // 1. Tạo Order + OrderDetail
    const order = await tx.order.create({
      data: {
        uid: Number(uid),

        discount:
          Number(discount),

        total_amount:
          Number(totalAmount),

        details: {
          create: items.map(
            (item) => ({
              pid:
                Number(item.pid),

              qty:
                Number(item.qty),

              unit_price:
                Number(item.unit_price),
            })
          ),
        },
      },

      include: {
        details: true,
      },
    });

    // 2. Chuẩn bị payload Kafka
    const payload = {
      oid:
        order.oid,

      uid:
        order.uid,

      discount:
        Number(order.discount),

      total_amount:
        Number(order.total_amount),

      items:
        order.details.map(
          (item) => ({
            pid:
              item.pid,

            qty:
              item.qty,

            unit_price:
              Number(
                item.unit_price
              ),
          })
        ),
    };

    // 3. Tạo Outbox trong CÙNG transaction
    await tx.outboxEvent.create({
      data: {
        aggregate_type:
          "Order",

        aggregate_id:
          String(order.oid),

        event_type:
          "order.created",

        payload,

        status:
          "PENDING",
      },
    });

    return order;
  });
}

  async findByOid(oid) {
    return prisma.order.findUnique({
      where: {
        oid: Number(oid),
      },

      include: {
        details: true,
      },
    });
  }

  async findByUid(uid) {
    return prisma.order.findMany({
      where: {
        uid: Number(uid),
      },

      include: {
        details: true,
      },

      orderBy: {
        created_at: "desc",
      },
    });
  }
}