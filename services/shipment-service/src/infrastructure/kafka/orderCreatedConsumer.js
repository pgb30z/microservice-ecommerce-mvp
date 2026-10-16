import "dotenv/config";

import {
  Kafka,
} from "kafkajs";

import {
  ShipmentRepository,
} from "../repositories/ShipmentRepository.js";

const kafka =
  new Kafka({
    clientId:
      "shipment-service",

    brokers: [
      process.env.KAFKA_BROKER ||
        "localhost:9092",
    ],
  });

const consumer =
  kafka.consumer({
    groupId:
      process.env.KAFKA_GROUP_ID ||
      "shipment-service-group",
  });

const shipmentRepository =
  new ShipmentRepository();

export async function startOrderCreatedConsumer() {

  await consumer.connect();

  console.log(
    "Shipment Kafka Consumer connected"
  );

  await consumer.subscribe({
    topic:
      process.env.ORDER_CREATED_TOPIC ||
      "order.created",

    /*
      Chỉ nhận các event mới.
      Không đọc lại toàn bộ event test cũ.
    */
    fromBeginning: false,
  });

  await consumer.run({

    eachMessage:
      async ({
        message,
      }) => {

        try {

          const event =
            JSON.parse(
              message.value.toString()
            );

          if (
            event.eventType !==
            "order.created"
          ) {
            return;
          }

          const oid =
            Number(
              event.data?.oid
            );

          if (!oid) {
            console.error(
              "Invalid order.created event"
            );

            return;
          }

          const shipment =
            await shipmentRepository
              .createForOrder(
                oid
              );

          console.log(
            `Shipment ${shipment.shipid} ready for Order ${shipment.oid}, status=${shipment.status}`
          );

        } catch (error) {

          console.error(
            "Shipment consumer error:",
            error.message
          );
        }
      },
  });
}