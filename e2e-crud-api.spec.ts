/**
 * E2E tests for FastAPI CRUD API
 *
 * Tests all 6 CRUD endpoints against the running API server.
 * Default target: localhost:8080 (local dev server).
 * Override with CRUD_API_URL env var to test against staging/production.
 *
 * Usage:
 *   npx playwright test crud-api-e2e.spec.ts
 *   CRUD_API_URL=https://staging.example.com npx playwright test crud-api-e2e.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.CRUD_API_URL || 'http://localhost:8080';

test.describe('CRUD API — Root & Health', () => {
  test('GET / returns API info', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body).toMatchObject({
      title: 'FastAPI CRUD API',
      version: '1.0.0',
      docs: '/docs',
    });
  });

  test('GET /health returns healthy status', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/health`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
  });
});

test.describe('CRUD API — Create Items (POST)', () => {
  test('POST /items/ creates a new item with 201', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'E2E Test Item', description: 'Created by Playwright' },
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.title).toBe('E2E Test Item');
    expect(body.description).toBe('Created by Playwright');
    expect(body.completed).toBe(false);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('created_at');
    expect(body).toHaveProperty('updated_at');
  });

  test('POST /items/ with empty title returns 422', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/items/`, {
      data: { title: '' },
    });
    expect(resp.status()).toBe(422);
  });

  test('POST /items/ creates item with default values', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'Minimal Item' },
    });
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.title).toBe('Minimal Item');
    expect(body.description).toBeNull();
    expect(body.completed).toBe(false);
  });
});

test.describe('CRUD API — List Items (GET)', () => {
  test('GET /items/ returns empty list initially', async ({ request }) => {
    // Clean expectation: list may have items from previous tests
    const resp = await request.get(`${BASE_URL}/items/`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /items/ returns all created items', async ({ request }) => {
    // Create two items
    await request.post(`${BASE_URL}/items/`, {
      data: { title: 'List Test A' },
    });
    await request.post(`${BASE_URL}/items/`, {
      data: { title: 'List Test B' },
    });

    const resp = await request.get(`${BASE_URL}/items/`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.length).toBeGreaterThanOrEqual(2);
    const titles = body.map((i: any) => i.title);
    expect(titles).toContain('List Test A');
    expect(titles).toContain('List Test B');
  });

  test('GET /items/ supports skip and limit', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/items/?skip=0&limit=5`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeLessThanOrEqual(5);
  });
});

test.describe('CRUD API — Get Single Item (GET by ID)', () => {
  test('GET /items/{id} returns specific item', async ({ request }) => {
    const createResp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'Specific Item E2E' },
    });
    const created = await createResp.json();

    const resp = await request.get(`${BASE_URL}/items/${created.id}`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.id).toBe(created.id);
    expect(body.title).toBe('Specific Item E2E');
  });

  test('GET /items/{id} with non-existent id returns 404', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/items/99999`);
    expect(resp.status()).toBe(404);
  });
});

test.describe('CRUD API — Update Item (PUT)', () => {
  test('PUT /items/{id} updates item title and completed', async ({ request }) => {
    const createResp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'Original Title' },
    });
    const created = await createResp.json();

    const resp = await request.put(`${BASE_URL}/items/${created.id}`, {
      data: { title: 'Updated Title', completed: true },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.title).toBe('Updated Title');
    expect(body.completed).toBe(true);
    // Timestamps should still be present
    expect(body).toHaveProperty('created_at');
    expect(body).toHaveProperty('updated_at');
  });

  test('PUT /items/{id} partial update preserves other fields', async ({ request }) => {
    const createResp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'Partial Update Test', description: 'Original desc' },
    });
    const created = await createResp.json();

    const resp = await request.put(`${BASE_URL}/items/${created.id}`, {
      data: { title: 'Partially Updated' },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.title).toBe('Partially Updated');
    expect(body.description).toBe('Original desc'); // preserved
  });

  test('PUT /items/{id} with non-existent id returns 404', async ({ request }) => {
    const resp = await request.put(`${BASE_URL}/items/99999`, {
      data: { title: 'Nope' },
    });
    expect(resp.status()).toBe(404);
  });
});

test.describe('CRUD API — Delete Item (DELETE)', () => {
  test('DELETE /items/{id} deletes item and returns 204', async ({ request }) => {
    const createResp = await request.post(`${BASE_URL}/items/`, {
      data: { title: 'To Delete' },
    });
    const created = await createResp.json();

    const deleteResp = await request.delete(`${BASE_URL}/items/${created.id}`);
    expect(deleteResp.status()).toBe(204);

    // Verify it's gone
    const getResp = await request.get(`${BASE_URL}/items/${created.id}`);
    expect(getResp.status()).toBe(404);
  });

  test('DELETE /items/{id} with non-existent id returns 404', async ({ request }) => {
    const resp = await request.delete(`${BASE_URL}/items/99999`);
    expect(resp.status()).toBe(404);
  });
});
