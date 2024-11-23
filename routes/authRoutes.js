const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require("passport");

router.post('/register', authController.register); // Rota de registro
router.post(
    "/login",
    passport.authenticate("local", { failureMessage: true }),
    (req, res) => {
      res.json({ message: "Logged in successfully." });
    }
  );// Rota de login

module.exports = router;
