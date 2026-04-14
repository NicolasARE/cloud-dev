import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import db from '../../src/persistence/sqlite.js';
import addItemController from '../../src/controllers/addItem.js';
import type { ToDoItemDtoAdd } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test.db');

beforeEach(async () => {
  process.env.SQLITE_DB_LOCATION = dbPath;
  process.env.NODE_ENV = 'test';

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  await db.init();

  const allItems = await db.getItems();
  for (const item of allItems) {
    await db.removeItem(item.id);
  }
});

afterEach(async () => {
  await db.teardown();

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});

describe('integration controller addItem', () => {
  test('crée un item et le retourne avec status 201', async () => {
    // ARRANGE
    const req = {
      body: {
        name: 'New item',
      } as ToDoItemDtoAdd,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    // ACT
    await addItemController(req, res);

    // ASSERT HTTP
    expect(res.status).toHaveBeenCalledWith(201);

    const createdItem = res.send.mock.calls[0][0];

    expect(createdItem).toMatchObject({
      name: 'New item',
      completed: false,
    });

    // ASSERT DB
    const items = await db.getItems();

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      name: 'New item',
      completed: false,
    });
  });

  test('retourne 400 si le nom est vide', async () => {
    // ARRANGE
    const req = {
        body: {
        name: ' ',
        } as ToDoItemDtoAdd,
    } as any;

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as any;

    // ACT
    await addItemController(req, res);

    // ASSERT HTTP
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Le nom est requis');

    // ASSERT DB
    const items = await db.getItems();

    expect(items).toHaveLength(0);
    });
});