import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "backend-service",
  brokers: ["kafka:9092"],
});