const UserService = require('../services/user.service');

exports.list = async function(req, res) {
  try {
    const result = await UserService.list();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.listPendingBoutiques = async function(req, res) {
  try {
    const result = await UserService.listPendingBoutiques();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.approveBoutique = async function(req, res) {
  try {
    const result = await UserService.approveBoutique(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la validation.' });
  }
};

exports.rejectBoutique = async function(req, res) {
  try {
    const result = await UserService.rejectBoutique(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors du refus.' });
  }
};
