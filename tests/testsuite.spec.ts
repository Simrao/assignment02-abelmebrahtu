import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';

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
    });