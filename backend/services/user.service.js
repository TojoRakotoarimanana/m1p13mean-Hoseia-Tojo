const { User } = require('../models');

class UserService {
  async list() {
    return User.find({}, 'email firstName lastName role isActive').sort({ createdAt: -1 });
  }

  async listPendingBoutiques() {
    return User.find({ role: 'boutique', isActive: false }, 'email firstName lastName phone isActive').sort({ createdAt: -1 });
  }

  async approveBoutique(userId) {
    if (!userId) {
      const error = new Error('userId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
    if (!user) {
      const error = new Error('Utilisateur introuvable.');
      error.status = 404;
      throw error;
    }

    return { message: 'Utilisateur boutique validé.', user };
  }

  async rejectBoutique(userId) {
    if (!userId) {
      const error = new Error('userId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Utilisateur introuvable.');
      error.status = 404;
      throw error;
    }

    await user.softDelete(null);

    return { message: 'Demande boutique refusée.', user };
  }
}

module.exports = new UserService();
