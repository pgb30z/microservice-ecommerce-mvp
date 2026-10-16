import {
  connectKafkaProducer,
  publishOrderCreated,
  disconnectKafkaProducer,
} from "./src/infrastructure/kafka/kafkaProducer.js";

async function main() {
  try {
    await connectKafkaProducer();

    const event =
      await publishOrderCreated({
        oid: 1000,

        uid: 4,

        discount: 0,

        total_amount: 15000000,

        items: [
          {
            pid: 1,
            qty: 1,
            unit_price: 15000000,
          },
        ],
      });

    console.log(
      "Kafka test successful!"
    );

    console.log(event);
  } catch (error) {
    console.error(
      "Kafka test failed:",
      error.message
    );
  } finally {
    await disconnectKafkaProducer();
  }
}

main();