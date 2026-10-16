import {
  connectKafkaProducer,
  disconnectKafkaProducer,
} from "./src/infrastructure/kafka/kafkaProducer.js";

import {
  publishPendingOutbox,
} from "./src/infrastructure/kafka/outboxPublisher.js";

async function main() {
  try {
    await connectKafkaProducer();

    await publishPendingOutbox();

    console.log(
      "Pending outbox processing completed!"
    );

  } catch (error) {

    console.error(
      "Outbox publisher failed:",
      error.message
    );

  } finally {

    await disconnectKafkaProducer();
  }
}

main();