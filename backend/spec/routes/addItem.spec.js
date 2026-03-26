const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const { v4: uuid } = require('uuid');

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('il stocke l\'élément correctement', async () => {
    const id = 'something-not-a-uuid';
    const name = 'Un élément d\'exemple';
    const req = { body: { name } };
    const res = { send: jest.fn() };

    uuid.mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = { id, name, completed: false };

    expect(db.storeItem.mock.calls.length).toBe(1);
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});

test('il retourne 400 quand le nom est manquant', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await addItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Le nom est requis');
    expect(db.storeItem).not.toHaveBeenCalled();
});

test('il retourne 400 quand le nom est vide', async () => {
    const req = { body: { name: '   ' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await addItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Le nom est requis');
    expect(db.storeItem).not.toHaveBeenCalled();
});
