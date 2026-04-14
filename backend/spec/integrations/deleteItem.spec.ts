import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import db from '../../src/persistence/sqlite.js';
import deleteItemController from '../../src/controllers/deleteItem.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test.db');

const ITEM: ToDoItem = {
  id: 'test-id-1',
  name: 'Item to delete',
  completed: false,
};

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

describe('integration controller deleteItem', () => {
  test('supprime un item existant et retourne 204', async () => {
    // ARRANGE
    await db.addItem(ITEM);

    const req = {
      params: {
        id: ITEM.id,
      },
    } as any;

    const res = {
      sendStatus: jest.fn(),
    } as any;

    // ACT
    await deleteItemController(req, res);

    // ASSERT HTTP
    expect(res.sendStatus).toHaveBeenCalledWith(204);

    // ASSERT DB
    const items = await db.getItems();

    expect(items).toHaveLength(0);
  });

  test('retourne 404 si item inexistant', async () => {
    // ARRANGE

    const req = {
        params: {
        id: 'id-qui-n-existe-pas',
        },
    } as any;

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as any;

    // ACT
    await deleteItemController(req, res);

    // ASSERT HTTP
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Item introuvable');

    // ASSERT DB
    const items = await db.getItems();

    expect(items).toHaveLength(0);
    });
});