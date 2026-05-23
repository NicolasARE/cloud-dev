import { kafka } from "./kafka.client.js";
import userService from "../../services/user.js";

const consumer = kafka.consumer({ groupId: "auth-service" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString());

      if (event.type === "TODOS_DELETED_SUCCESSFULLY") {
        await userService.deleteAccountDefinitively(event.userId);
      }
    },
  });
}