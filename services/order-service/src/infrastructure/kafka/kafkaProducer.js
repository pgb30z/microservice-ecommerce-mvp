import "dotenv/config";

import { Kafka } from "kafkajs";
import { randomUUID } from "crypto";

const kafka = new Kafka({
  clientId:
    process.env.KAFKA_CLIENT_ID ||
    "order-service",

  brokers: [
    process.env.KAFKA_BROKER ||
      "localhost:9092",
  ],
});

const producer =
  kafka.producer();

let connected = false;

export async function connectKafkaProducer() {
  if (connected) {
    return;
  }

  await producer.connect();

  connected = true;

  console.log(
    "Order Kafka Producer connected"
  );
}

export async function publishOrderCreated(
  order
) {
  if (!connected) {
    await connectKafkaProducer();
  }

  const event = {
    eventId: randomUUID(),

    eventType:
      "order.created",

    occurredAt:
      new Date().toISOString(),

    data: order,
  };

  await producer.send({
    topic:
      process.env.ORDER_CREATED_TOPIC ||
      "order.created",

    messages: [
      {
        key:
          String(order.oid),

        value:
          JSON.stringify(event),
      },
    ],
  });

  console.log(
    `order.created published for order ${order.oid}`
  );

  return event;
}

export async function disconnectKafkaProducer() {
  if (!connected) {
    return;
  }

  await producer.disconnect();

  connected = false;
}
export async function publishEvent({
  topic,
  key,
  event,
}) {
  if (!connected) {
    await connectKafkaProducer();
  }

  await producer.send({
    topic,

    messages: [
      {
        key:
          String(key),

        value:
          JSON.stringify(event),
      },
    ],
  });
}