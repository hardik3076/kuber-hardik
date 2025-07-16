const request = require('supertest');
const app = require('../app'); // Adjust path if needed

describe('Menu API', () => {
  it('should list all menu items', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should not allow non-admin to create menu item', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({ name: 'Pizza', category: 'Main', price: 10, description: 'Cheese pizza', available: true });
    expect(res.statusCode).toBe(401); // Unauthorized
  });

  it('should not allow non-admin to update menu item', async () => {
    const res = await request(app)
      .put('/api/menu/1')
      .send({ name: 'Updated Pizza', price: 12 });
    expect(res.statusCode).toBe(401); // Unauthorized
  });

  it('should not allow non-admin to delete menu item', async () => {
    const res = await request(app)
      .delete('/api/menu/1');
    expect(res.statusCode).toBe(401); // Unauthorized
  });

  // You can add more tests for admin actions by mocking or providing a valid admin user
});