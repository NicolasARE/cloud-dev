const db = require('../../src/persistence');
const updateItem = require('../../src/routes/updateItem');
const ITEM = { id: 12345 };

jest.mock('../../src/persistence', () => ({
    getItem: jest.fn(),
    updateItem: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('il met à jour les éléments correctement', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: 'Nouveau titre', completed: false },
    };
    const res = { send: jest.fn() };

    db.getItem.mockReturnValue(Promise.resolve(ITEM));

    await updateItem(req, res);

    expect(db.updateItem.mock.calls.length).toBe(1);
    expect(db.updateItem.mock.calls[0][0]).toBe(req.params.id);
    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'Nouveau titre',
        completed: false,
    });

    expect(db.getItem.mock.calls.length).toBe(1);
    expect(db.getItem.mock.calls[0][0]).toBe(req.params.id);

    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(ITEM);
});

test('il retourne 400 quand le nom est vide', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: '  ', completed: false },
    };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Le nom est requis');
    expect(db.updateItem).not.toHaveBeenCalled();
});
