import { kafka } from "./kafka.client";

const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
}

export async function sendUserEvent(event: {
  type: "USER_DELETED";
  userId: string;
}) {
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