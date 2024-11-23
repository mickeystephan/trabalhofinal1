const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pool = require('./config/db'); // Conexão com o banco de dados PostgreSQL
require("dotenv").config()
const bcrypt = require('bcryptjs');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: 'secret-key', // Use uma chave secreta para segurança
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const res = await pool.query("SELECT * FROM users WHERE username = $1", [
          username,
        ]);
        const user = res.rows[0];
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = res.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
// Middleware simples para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Se o ID do usuário estiver na sessão, ele está logado
        return next(); // Segue para a próxima função de rota
    }
    res.status(401).json({ message: 'Você precisa estar logado para acessar essa página.' });
};

// Definindo as rotas
app.use('/api/auth', authRoutes); // Roteiro de autenticação (login, registro, etc.)
app.use('/api/products', productRoutes); // Roteiro de produtos
app.use('/api/orders', isAuthenticated, orderRoutes); // Roteiro de pedidos (precisa estar autenticado)

// Conectar ao banco de dados e iniciar o servidor
pool.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados', err);
    });
