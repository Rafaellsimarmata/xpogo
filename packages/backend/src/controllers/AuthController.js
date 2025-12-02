const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const newUser = await AuthService.register(email, username, password);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
