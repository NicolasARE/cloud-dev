import { kafka } from "./kafka.client.js";
import userService from "../../services/user.js";

const consumer = kafka.consumer({ groupId: "auth-service" });

export async function startConsumer() {
  let retries = 5;
  while (retries > 0) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "user-events", fromBeginning: false });
      break;
    } catch (err) {
      retries--;
      console.warn(`Failed to connect/subscribe consumer (remaining retries: ${retries}):`, err);
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString());

      if (event.type === "TODOS_DELETED_SUCCESSFULLY") {
        await userService.deleteAccountDefinitively(event.userId);
      }
    },
  });
}