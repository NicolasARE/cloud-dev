const db = require('../persistence');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
    if (!req.body.name || !req.body.name.trim()) {
        return res.status(400).send('Le nom est requis');
    }

    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);
    res.send(item);
};
