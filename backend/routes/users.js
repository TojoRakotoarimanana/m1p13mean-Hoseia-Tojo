var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');

router.get('/', UserController.list);
router.get('/boutiques/pending', UserController.listPendingBoutiques);
router.post('/boutiques/:id/approve', UserController.approveBoutique);
router.post('/boutiques/:id/reject', UserController.rejectBoutique);


module.exports = router;
