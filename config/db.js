const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres', // Usuário padrão
  host: 'localhost', // Banco de dados local
  database: 'database', // Nome do seu banco
  password: 'password', // Sua senha
  port: 5432, // Porta padrão
});

module.exports = pool;
