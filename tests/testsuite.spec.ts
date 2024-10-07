import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';


const BASE_URL = 'http://localhost:3000/';

test.describe('TheTester Hotel API Tests', () => {
  let request: APIRequestContext;
  let token: string;

  test.beforeAll(async ({ playwright }) => {
      request = await playwright.request.newContext({
      baseURL: BASE_URL,
    });


    const loginResponse = await request.post('/api/login', {
      data: {
        username: 'tester01',
        password: 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c',
      },
      headers: { 'Content-Type': 'application/json' },
    });
    const loginData = await loginResponse.json();
    token = loginData.token;
    expect(token).toBeDefined();
  });

    // 1. Create new client
    test('TC 01 - Create new client ', async () => {
        const payload = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        };
        const response = await request.post('/api/client/new', {
          data: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'X-user-auth': JSON.stringify({ username: 'tester01', token }),
          },
        });
        expect(response.ok()).toBeTruthy();
        const client = await response.json();
        expect(client.name).toBe(payload.name);
        expect(client.email).toBe(payload.email);
      });
    

    // 2. Get all clients
    test('TC 02 - Get all clients', async () => {
    const response = await request.get('/api/clients', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const clients = await response.json();
    expect(clients.length).toBeGreaterThan(0);
  });

    // 3. Update client
    test('TC 03 - Update client', async () => {
    const clientId = 2;
    const payload = {
      id: '2',
      name: 'Mikael Eriksson',
      email: 'mikael.eriksson@example.com',
    };
    const response = await request.put(`/api/client/${clientId}`, {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();
    const updatedClient = await response.json();
    expect(updatedClient.name).toBe(payload.name);
  });
});