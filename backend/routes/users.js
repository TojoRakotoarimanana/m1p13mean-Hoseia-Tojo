var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');
const { adminOnly } = require('../middleware');

router.get('/', UserController.list);
router.get('/boutiques/pending', UserController.listPendingBoutiques);
router.post('/boutiques/:id/approve', UserController.approveBoutique);
router.post('/boutiques/:id/reject', UserController.rejectBoutique);

router.put('/:id', adminOnly, UserController.update);

module.exports = router;
