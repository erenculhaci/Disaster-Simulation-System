const express = require('express');
const Node = require('../models/Node');

const router = express.Router();

// Get all nodes
router.get('/', async (req, res) => {
    const nodes = await Node.findAll();
    res.json(nodes);
});

// Add a new node
router.post('/', async (req, res) => {
    const { lat, lng } = req.body;
    const newNode = await Node.create({ lat, lng });
    res.json(newNode); // Return the created node with its ID
});

// Delete a node
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Node.destroy({ where: { id } });
    res.json({ message: 'Node deleted' });
});

// Delete all nodes
router.delete('/', async (req, res) => {
    await Node.destroy({ where: {} }); // Deletes all records
    res.json({ message: 'All nodes deleted' });
});

module.exports = router;
