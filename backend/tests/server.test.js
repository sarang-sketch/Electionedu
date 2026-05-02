const request = require('supertest');
const app = require('../server');

describe('Backend API Endpoints (Integration Tests)', () => {
  it('GET /api/health should return 200 OK and server status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('googleServices');
  });

  it('GET /api/google-services should return 200 and list services', async () => {
    const res = await request(app).get('/api/google-services');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalGoogleServices');
    expect(Array.isArray(res.body.services)).toBe(true);
  });

  it('POST /api/chat without message should return 400', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('Missing required fields');
  });

  it('POST /api/translate without required fields should return 400', async () => {
    const res = await request(app).post('/api/translate').send({ text: 'Hello' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('Missing required fields');
  });

  it('GET /non-existent-route should return 404', async () => {
    const res = await request(app).get('/api/fake-route-for-testing-12345');
    expect(res.statusCode).toEqual(404);
  });
});
