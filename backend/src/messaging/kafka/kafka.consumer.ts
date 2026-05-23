import { kafka } from "./kafka.client.js";
import itemService from "../../services/item.js";

const consumer = kafka.consumer({ groupId: "todo-service" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString());

      if (event.type === "USER_DELETED") {
        await itemService.deleteItemsByUserId(event.userId);    
      }
    },
  });
}