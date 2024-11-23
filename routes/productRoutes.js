const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/create', productController.createProduct); // Rota para criar produto
router.get('/', productController.getProducts); // Rota para listar produtos

module.exports = router;
