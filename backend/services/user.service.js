const { User } = require('../models');

class UserService {
  async list() {
    return User.find({}, 'email firstName lastName role isActive').sort({ createdAt: -1 });
  }
}

module.exports = new UserService();
