const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// On importe protect et admin pour sécuriser l'accès
const { protect, admin } = require('../middleware/authMiddleware'); 

/**
 * @route   GET /api/users
 * @desc    Récupérer tous les clients (Rôle 'client' uniquement)
 * @access  Privé (Admin uniquement)
 */
router.get('/users', protect, admin, userController.getAllUsers);

module.exports = router;