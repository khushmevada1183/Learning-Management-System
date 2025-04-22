import request from 'supertest';
import { app } from '../app';

describe('Server Tests', () => {
  describe('GET /test', () => {
    it('should return 200 and success message', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        succcess: true,
        message: 'API is working',
      });
    });
  });

  describe('GET /api/v1/unknown-route', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/unknown-route');
      expect(response.status).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit requests after threshold', async () => {
      // Make multiple requests to trigger rate limit
      const requests = Array(101).fill(null).map(() => 
        request(app).get('/test')
      );
      
      const responses = await Promise.all(requests);
      const limitedResponse = responses[responses.length - 1];
      
      expect(limitedResponse.status).toBe(429);
      expect(limitedResponse.body.message).toContain('Too many requests');
    });
  });
}); 