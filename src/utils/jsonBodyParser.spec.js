const bodyParser = require('./jsonBodyParser');


describe('jsonBodyParser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not register event handlers if req method is not POST', () => {
    const mockNext = jest.fn();
    const mockEventEmitter = jest.fn();

    bodyParser({ method: 'GET', on: mockEventEmitter }, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter).toHaveBeenCalledTimes(0);
  });

  it('should register event handler if method is POST', () => {
    const mockNext = jest.fn();
    const mockEventEmitter = jest.fn();

    bodyParser({ method: 'POST', on: mockEventEmitter }, null, mockNext);

    expect(mockEventEmitter).toHaveBeenCalledTimes(2);
  });

  it('should collect chunks of body', () => {
    const mockNext = jest.fn();
    let dataEvent;
    let endEvent;
    const mockEventEmitter = jest.fn().mockImplementation((eventName, cb) => {
      if (eventName === 'data') {
        dataEvent = cb;
      }
      if (eventName === 'end') {
        endEvent = cb;
      }
    });

    const mockReq = { method: 'POST', on: mockEventEmitter };

    bodyParser(mockReq, null, mockNext);

    expect(mockEventEmitter).toHaveBeenCalledTimes(2);
    expect(dataEvent).toBeDefined();
    expect(endEvent).toBeDefined();

    dataEvent('chunk1');
    dataEvent('chunk2');
    endEvent();

    expect(mockNext).toHaveBeenCalledTimes(1);
    const callData = mockNext.mock.calls[0];
    expect(callData[0]).toEqual({ status: 400,  message: 'Invalid request body' });
  });

  it('should parse the collected chunks to JSON object', () => {
    const mockNext = jest.fn();
    let dataEvent;
    let endEvent;
    const mockEventEmitter = jest.fn().mockImplementation((eventName, cb) => {
      if (eventName === 'data') {
        dataEvent = cb;
      }
      if (eventName === 'end') {
        endEvent = cb;
      }
    });

    const mockReq = { method: 'POST', on: mockEventEmitter };

    bodyParser(mockReq, null, mockNext);

    expect(mockEventEmitter).toHaveBeenCalledTimes(2);
    expect(dataEvent).toBeDefined();
    expect(endEvent).toBeDefined();

    const testData = { test: ['data'] };

    dataEvent(JSON.stringify(testData));
    endEvent();

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockReq.body).toEqual(testData);
  });
});
