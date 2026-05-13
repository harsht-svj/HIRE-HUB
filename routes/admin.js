const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLogged, isAdmin } = require('../middleware.js');
const adminController = require('../controllers/admin.js');

router.get('/admin/dashboard', isLogged, isAdmin, wrapAsync(adminController.dashboard));
router.delete('/admin/users/:id', isLogged, isAdmin, wrapAsync(adminController.deleteUser));
router.delete('/admin/jobs/:id', isLogged, isAdmin, wrapAsync(adminController.deleteJob));

module.exports = router;