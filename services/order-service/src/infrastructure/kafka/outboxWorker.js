import {
  publishPendingOutbox,
} from "./outboxPublisher.js";

let isRunning = false;

export function startOutboxWorker(
  intervalMs = 5000
) {
  console.log(
    `Outbox Worker started, interval=${intervalMs}ms`
  );

  setInterval(
    async () => {
      /*
        Tránh lần chạy sau bắt đầu
        khi lần trước chưa xử lý xong.
      */
      if (isRunning) {
        return;
      }

      isRunning = true;

      try {
        await publishPendingOutbox();
      } catch (error) {
        console.error(
          "Outbox Worker error:",
          error.message
        );
      } finally {
        isRunning = false;
      }
    },

    intervalMs
  );
}