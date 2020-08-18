const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const options = {
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
};

function get(key) {
  return axios.get(`${BASE_URL}/${key}`, options);
}

function set(key, value) {
  return axios.post(`${BASE_URL}/${key}`, value, options);
}

function del(key) {
  return axios.delete(`${BASE_URL}/${key}`, options);
}

describe('E2E testing webredis', () => {
  it('should be able set, get and delete data from redis', async () => {
    const testKey = 'testKey';
    const testValue = { some: {
      big: {
        nested: ['JSON', 'obejct'],
        with: 'many'
      },
      different: ['fields'],
    }};
    const { status: postStatus, data: postData } = await set(testKey, testValue);

    expect(postStatus).toBe(200);
    expect(postData).toEqual({ success: true });

    const { status: getStatus, data: getData } = await get(testKey);

    expect(getStatus).toBe(200);
    expect(getData).toEqual(testValue);

    const { status: delStatus, data: delData } = await del(testKey);

    expect(delStatus).toBe(200);
    expect(delData).toEqual({ success: true });

    const { status: get2Status, data: get2Data } = await get(testKey);
    expect(get2Status).toBe(404);
    expect(get2Data).toEqual({ error: 'Value not found for testKey' });
  });
});
