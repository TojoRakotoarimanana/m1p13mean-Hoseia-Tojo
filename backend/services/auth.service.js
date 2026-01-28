const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it';

class AuthService {
  async register(data) {
    const { email, password, confirmPassword, firstName, lastName, role = 'client', phone, address } = data;

    if (!email || !password || !confirmPassword) {
      const error = new Error('Tous les champs obligatoires doivent être remplis.');
      error.status = 400;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error('Les mots de passe ne correspondent pas.');
      error.status = 400;
      throw error;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('Cet email est déjà utilisé.');
      error.status = 400;
      throw error;
    }

    const newUser = new User({ email, password, firstName, lastName, role, phone, address });
    await newUser.save();

    const token = this.generateToken(newUser);

    return {
      message: 'Inscription réussie !',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    };
  }

  async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email et mot de passe requis.');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Email ou mot de passe incorrect.');
      error.status = 400;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Ce compte a été désactivé.');
      error.status = 403;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      message: 'Connexion réussie !',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthService();
