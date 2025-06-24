const express = require('express');
const router = express.Router();
const controlador = require('./controlador');

// Obtener todas las puertas
router.get('/', async (req, res) => {
  try {
    const items = await controlador.todos();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener puertas', error });
  }
});

// Obtener una puerta por id
router.get('/:id', async (req, res) => {
  try {
    const item = await controlador.uno(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la puerta', error });
  }
});

// Agregar una nueva puerta
router.post('/agregar', async (req, res) => {
  try {
    const result = await controlador.agregar(req.body);
    res.status(200).json({ message: 'Puerta agregada', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar puerta', error });
  }
});

// Eliminar una puerta
router.delete('/eliminar', async (req, res) => {
  try {
    const result = await controlador.eliminar(req.body);
    res.status(200).json({ message: 'Puerta eliminada', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar puerta', error });
  }
});

// Actualizar el estado de una puerta
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;
    const result = await controlador.actualizarEstado(id, estado);
    res.status(200).json({ message: 'Estado actualizado', result });
  } catch (error) {
    console.error('Error real:', error);
    res.status(500).json({ message: 'Error al actualizar estado', error });
  }
});

module.exports = router;