import { kafka } from "./kafka.client.js";

const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
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
        messages: [{
            key: event.userId,
            value: JSON.stringify(event),
        }]
    });
}