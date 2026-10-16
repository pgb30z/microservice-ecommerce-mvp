import "dotenv/config";

import {
  OutboxRepository,
} from "../repositories/OutboxRepository.js";

import {
  publishEvent,
} from "./kafkaProducer.js";

const outboxRepository =
  new OutboxRepository();

export async function publishPendingOutbox() {

  const events =
    await outboxRepository.findPending(
      10
    );

  if (events.length === 0) {
    console.log(
      "No pending outbox events"
    );

    return;
  }

  for (const row of events) {

    const event = {
      eventId:
        row.id,

      eventType:
        row.event_type,

      occurredAt:
        row.created_at.toISOString(),

      data:
        row.payload,
    };

    try {

      await publishEvent({
        topic:
          process.env.ORDER_CREATED_TOPIC ||
          "order.created",

        key:
          row.aggregate_id,

        event,
      });

      await outboxRepository
        .markPublished(
          row.id
        );

      console.log(
        `Outbox event ${row.id} published`
      );

    } catch (error) {

      /*
        Không đổi thành PUBLISHED.

        Lần chạy sau worker
        sẽ thử gửi lại.
      */

      console.error(
        `Outbox event ${row.id} failed:`,
        error.message
      );
    }
  }
}