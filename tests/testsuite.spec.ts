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
    console.log(token); 
    expect(token).toBeDefined();
  });

// 1. Create new client
test('TC 01 - Create new client ', async () => {
        const payload = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          telephone:faker.phone.number({ style: 'international' }),

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
        id: 2,
      name: 'Mikael Eriksson',
      email: 'mikael.eriksson@example.com',
      telephone: '0734467902'
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

 // 4. Get all bills
 test('TC 04 - Get all bills', async () => {
    const response = await request.get('/api/bills', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const bills = await response.json();
    expect(bills.length).toBeGreaterThan(0);
  });

 // 5. Get bill with ID
 test('TC 05 - Get bill with ID', async () => {
    const billId = 1;
    const response = await request.get(`/api/bill/${billId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    const bill = await response.json();
    expect(bill.id).toBe(billId);
  });

// 6. Get Client with ID
test('TC 06 - Get client with ID', async () => {
    const clientId = 1;
    const response = await request.get(`/api/client/${clientId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    const client = await response.json();
    expect(client.id).toBe(clientId);
  });

// 7. Find all rooms
test('TC 07 - Find all rooms', async () => {
    const response = await request.get('/api/rooms', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const rooms = await response.json();
    expect(rooms.length).toBeGreaterThan(0);
  });

// 8. Get room with ID
test('TC 08 - Get room with ID', async () => {
    const roomId = 1;
    const response = await request.get(`/api/room/${roomId}`, {
        headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    
    const room = await response.json();
    expect(room.id).toBe(roomId);
  });

// 9. Update reservation
test('TC 09 - Update reservation', async () => {
    const reservationId = 1;
    const payload = {
      start: '2024-10-16',
      end: '2024-10-22',
      client: 'Jonas Hellman',
      room: 'Floor 2, Room 201',
      bill: 'ID: 1',
    };

    const response = await request.put(`/api/reservation/${reservationId}`, {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();

    const updatedReservation = await response.json();
    expect(updatedReservation.start).toBe(payload.start);
    expect(updatedReservation.end).toBe(payload.end);
    expect(updatedReservation.client).toBe(payload.client);
    expect(updatedReservation.room).toBe(payload.room);
    expect(updatedReservation.bill).toBe(payload.bill);
  });
})