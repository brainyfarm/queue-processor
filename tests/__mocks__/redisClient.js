const redisMock = {
  connect: jest.fn(),
  on: jest.fn(),
  incr: jest.fn(),
  exists: jest.fn(() => Promise.resolve(true)),
  set: jest.fn(),
  zAdd: jest.fn(),
  zPopMax: jest.fn(() => Promise.resolve({ value: '{"name": "test job"}' })),
  del: jest.fn(),
  rPush: jest.fn(),
  lRange: jest.fn(() => Promise.resolve([])),
  sIsMember: jest.fn(() => Promise.resolve(false)),
  sAdd: jest.fn(),
  get: jest.fn(() => Promise.resolve(1)),
};

export default redisMock;
