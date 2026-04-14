import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import db from '../../src/persistence/sqlite.js';
import getItemsController from '../../src/controllers/getItems.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test.db');

const ITEM: ToDoItem = {
  id: '1',
  name: 'integration item',
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

describe('integration controller getItems', () => {
  test('retourne les items depuis la vraie DB', async () => {
    // ARRANGE
    await db.addItem(ITEM);

    const req = {} as any;

    const res = {
      send: jest.fn(),
    } as any;

    // ACT
    await getItemsController(req, res);

    // ASSERT
    expect(res.send).toHaveBeenCalledWith([
      {
        id: ITEM.id,
        name: ITEM.name,
        completed: ITEM.completed,
      },
    ]);
  });
});