const pool = require('../config/db'); // Conexão com o banco de dados

// Criar um novo pedido
exports.createOrder = async (req, res) => {
  const { product_id, quantity, status = 'pending' } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id,product_id,quantity, status) VALUES ($1, $2, $3,$4) RETURNING *',
      [req.user.id,product_id,quantity, status]
    );
    res.status(201).json({ message: 'Pedido criado com sucesso', order: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

// Obter todos os pedidos
exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query('select  	orders.id as order_id,  	products.name as product_name, 	orders.quantity as quantity,  	products.price as unit_price, 	products.price * orders.quantity as total_price, 	users.username as bought_by from orders  inner join products  	on orders.product_id = products.id inner join users 	on orders.user_id = users.id;   ');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter pedidos', error: error.message });
  }
};
