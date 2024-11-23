const pool = require('../config/db'); // Conexão com o banco de dados

// Criar um novo produto
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );
    res.status(201).json({ message: 'Produto criado com sucesso', product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

// Obter todos os produtos
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
};
