const jwt = require('jsonwebtoken');
const { User, Shop } = require('../models');

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

  async registerBoutique(data) {
    const { email, password, confirmPassword, phone, firstName, lastName, shop } = data;

    if (!email || !password || !confirmPassword || !shop?.name || !shop?.category) {
      const error = new Error('Email, mot de passe, et informations de boutique sont requis.');
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

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: 'boutique',
      phone,
      isActive: false
    });
    await newUser.save();

    const newShop = new Shop({
      userId: newUser._id,
      name: shop.name,
      category: shop.category,
      description: shop.description,
      logo: shop.logo,
      location: shop.location,
      contact: shop.contact,
      hours: shop.hours,
      status: 'pending'
    });
    await newShop.save();

    return {
      message: 'Inscription boutique en attente de validation par un admin.',
      shop: newShop,
      user: {
        id: newUser._id,
        email: newUser.email,
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
