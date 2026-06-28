import { Kafka, Producer, Consumer, logLevel, KafkaConfig, ProducerRecord, RecordMetadata } from 'kafkajs';

export interface KafkaClientOptions {
  clientId?: string;
  brokers?: string[];
  topicPrefix?: string;
  groupId?: string;
  logLevel?: logLevel;
}

export class KafkaClient {
  private kafka: Kafka;
  private producer?: Producer;
  private consumer?: Consumer;
  private readonly clientId: string;
  private readonly brokers: string[];
  private readonly topicPrefix?: string;
  private readonly groupId?: string;

  private resolveTopic(topic: string): string {
    return this.topicPrefix ? `${this.topicPrefix}.${topic}` : topic;
  }

  constructor(options: KafkaClientOptions = {}) {
    this.clientId = options.clientId ?? 'ecommerce-service';
    this.brokers = options.brokers ?? (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
    this.topicPrefix = options.topicPrefix;
    this.groupId = options.groupId;

    const kafkaConfig: KafkaConfig = {
      clientId: this.clientId,
      brokers: this.brokers,
      logLevel: options.logLevel ?? logLevel.WARN,
    };

    this.kafka = new Kafka(kafkaConfig);
  }

  async connectProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }

    return this.producer;
  }

  async connectConsumer(topics: string[], handler: (messageValue: unknown) => Promise<void> | void): Promise<Consumer> {
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({ groupId: this.groupId ?? `${this.clientId}-group` });
      await this.consumer.connect();
    }

    await this.consumer.subscribe({ topics: topics.map((topic) => this.resolveTopic(topic)), fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (!value) return;

        try {
          const parsed = JSON.parse(value);
          await handler(parsed);
        } catch {
          await handler(value);
        }
      },
    });

    return this.consumer;
  }

  async publish(topic: string, message: unknown): Promise<RecordMetadata[]> {
    const producer = await this.connectProducer();
    const payload: ProducerRecord = {
      topic: this.resolveTopic(topic),
      messages: [{ value: JSON.stringify(message) }],
    };

    return producer.send(payload);
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }

    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}

export function createKafkaClient(options: KafkaClientOptions = {}): KafkaClient {
  return new KafkaClient(options);
}
