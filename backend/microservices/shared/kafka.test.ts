import { createKafkaClient } from './kafka';

describe('createKafkaClient', () => {
  it('creates a client with default broker configuration', () => {
    const client = createKafkaClient({ clientId: 'test-client' });
    expect(client).toBeDefined();
  });
});
