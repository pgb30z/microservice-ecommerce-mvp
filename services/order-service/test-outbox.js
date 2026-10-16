import prisma from "./src/infrastructure/database/prisma.js";

import {
  OutboxRepository,
} from "./src/infrastructure/repositories/OutboxRepository.js";

import {
  publishPendingOutbox,
} from "./src/infrastructure/kafka/outboxPublisher.js";

import {
  connectKafkaProducer,
  disconnectKafkaProducer,
} from "./src/infrastructure/kafka/kafkaProducer.js";

const outboxRepository =
  new OutboxRepository();

async function main() {

  try {

    /*
      Dùng Order 4 hiện có.
      Không tạo Order mới.
    */

    const order =
      await prisma.order.findUnique({
        where: {
          oid: 4,
        },

        include: {
          details: true,
        },
      });

    if (!order) {
      throw new Error(
        "Order 4 not found"
      );
    }

    const payload = {
      oid:
        order.oid,

      uid:
        order.uid,

      discount:
        Number(
          order.discount
        ),

      total_amount:
        Number(
          order.total_amount
        ),

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

    const outbox =
      await outboxRepository.create({
        aggregateType:
          "Order",

        aggregateId:
          order.oid,

        eventType:
          "order.created",

        payload,
      });

    console.log(
      "Outbox created:"
    );

    console.log(outbox);

    await connectKafkaProducer();

    await publishPendingOutbox();

    console.log(
      "Outbox test successful!"
    );

  } catch (error) {

    console.error(
      "Outbox test failed:",
      error.message
    );

  } finally {

    await disconnectKafkaProducer();

    await prisma.$disconnect();
  }
}

main();