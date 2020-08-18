const redisService = require('./redis.service');
const redisController = require('./redis.controller');

jest.mock('./redis.service');

describe('redisController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    it('should throw error if no value is found', () => {
      redisService.get.mockResolvedValueOnce(null);
      expect(redisController.getData('test')).rejects.toEqual({
        status: 404,
        message: 'Value not found for test',
      });
    });

    it('should throw error if corrupt data is stored', () => {
      redisService.get.mockResolvedValueOnce('notJSON');
      expect(redisController.getData('test')).rejects.toEqual({
        status: 400,
        message: 'Non JSON value stored',
      });
    });

    it('should return parsed data if json was stored base64 as expected', async () => {
      const testKey = 'testKey';
      const testData = {
        some: {
          random: ['deep', { json: 'structure'}]
        }
      };
      redisService.get.mockResolvedValueOnce(Buffer.from(JSON.stringify(testData)).toString('base64'));

      const result = await redisController.getData(testKey);

      expect(result).toEqual(testData);
      expect(redisService.get).toHaveBeenCalledTimes(1);
      const callParams = redisService.get.mock.calls[0];
      expect(callParams.length).toBe(1);
      expect(callParams[0]).toBe(testKey);
    });
  });

  describe('setData', () => {
    it('should store data base64 encoded', async () => {
      const testKey = 'testKey';
      const testData = { json: ['data', 'test'] };

      await redisController.setData(testKey, testData);

      expect(redisService.set).toHaveBeenCalledTimes(1);
      const callParams = redisService.set.mock.calls[0];
      expect(callParams.length).toBe(2);
      expect(callParams[0]).toBe(testKey);
      expect(callParams[1]).toBe(Buffer.from(JSON.stringify(testData)).toString('base64'));
    });
  });

  describe('deleteData', () => {
    it('should throw error if no deletion happened', () => {
      redisService.del.mockResolvedValueOnce(0);
      expect(redisController.deleteData('test')).rejects.toEqual({
        status: 404,
        message: 'Value not found for test',
      });
    });

    it('should delete only the provided key', async () => {
      const testKey = 'testKey';
      redisService.del.mockResolvedValueOnce(1);

      await redisController.deleteData(testKey);

      expect(redisService.del).toHaveBeenCalledTimes(1);
      const callParams = redisService.del.mock.calls[0];
      expect(callParams.length).toBe(1);
      expect(callParams[0]).toBe(testKey);
    });
  });
});
