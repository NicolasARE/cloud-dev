const db = require('../persistence');

module.exports = async (req, res) => {
    if (!req.body.name || !req.body.name.trim()) {
        return res.status(400).send('Le nom est requis');
    }

    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};
