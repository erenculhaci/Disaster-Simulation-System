const express = require('express');
const Node = require('../models/Node');

const router = express.Router();

router.get('/', async (req, res) => {
    const nodes = await Node.findAll();
    res.json(nodes);
});

router.post('/', async (req, res) => {
    const { lat, lng } = req.body;
    const newNode = await Node.create({ lat, lng });
    res.json(newNode);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Node.destroy({ where: { id } });
    res.json({ message: 'Node deleted' });
});

router.delete('/', async (req, res) => {
    await Node.destroy({ where: {} });
    res.json({ message: 'All nodes deleted' });
});

module.exports = router;
