const request = require('supertest');
const server = require('../../src/server');
const redisService = require('../../src/redis/redis.service');

jest.mock('../../src/redis/redis.service');

describe('webredis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should grab data for key from redis', async () => {
    const testKey = 'testKey';
    const testData = {
      test: 'data',
    };
    redisService.get.mockResolvedValueOnce(Buffer.from(JSON.stringify(testData)).toString('base64'));

    const res = await request(server).get(`/${testKey}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testData);
    expect(redisService.get).toHaveBeenCalledTimes(1);
    const callData = redisService.get.mock.calls[0];
    expect(callData.length).toBe(1);
    expect(callData[0]).toBe(testKey);
  });

  it('should return error if no data is found', async () => {
    const testKey = 'testKey';
    redisService.get.mockResolvedValueOnce(null);

    const res = await request(server).get(`/${testKey}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: `Value not found for ${testKey}` });
    expect(redisService.get).toHaveBeenCalledTimes(1);
    const callData = redisService.get.mock.calls[0];
    expect(callData.length).toBe(1);
    expect(callData[0]).toBe(testKey);
  });

  it('should return error if non JSON data is provided', async () => {
    const testKey = 'testKey';
    const res = await request(server).post(`/${testKey}`).send('not a JSON');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid request body' });
    expect(redisService.get).toHaveBeenCalledTimes(0);
  });

  it('should store data base64 encoded', async () => {
    const testKey = 'testKey';
    const testData = { json: 'data' };
    redisService.set.mockResolvedValueOnce('OK');

    const res = await request(server).post(`/${testKey}`).send(testData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 'OK' });
    expect(redisService.set).toHaveBeenCalledTimes(1);
    const callData = redisService.set.mock.calls[0];
    expect(callData[0]).toBe(testKey);
    expect(callData[1]).toBe(Buffer.from(JSON.stringify(testData)).toString('base64'));
  });

  it('should delete key', async () => {
    const testKey = 'testKey';
    redisService.del.mockResolvedValueOnce(1);

    const res = await request(server).delete(`/${testKey}`);

    expect(res.status).toBe(200);
    expect(redisService.del).toHaveBeenCalledTimes(1);
    const callData = redisService.del.mock.calls[0];
    expect(callData[0]).toBe(testKey);
  });
});
