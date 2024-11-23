const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createOrder); // Rota para criar pedido
router.get('/', orderController.getOrders); // Rota para listar pedidos

module.exports = router;
