import { kafka } from "./kafka.client.js";

const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    let retries = 5;
    while (retries > 0) {
      try {
        await producer.connect();
        isConnected = true;
        break;
      } catch (err) {
        retries--;
        console.warn(`Failed to connect producer (remaining retries: ${retries}):`, err);
        if (retries === 0) throw err;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}

export async function sendUserEvent(event: {
  type: "TODOS_DELETED_SUCCESSFULLY";
  userId: string;
}) {
  if (!isConnected) {
    await connectProducer();
  }

  await producer.send({
    topic: "user-events",
    messages: [
      {
        key: event.userId,
        value: JSON.stringify(event),
      },
    ],
  });
}