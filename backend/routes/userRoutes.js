const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Static routes FIRST
router.get('/governorats', userController.getGovernorats);
router.get('/categories', userController.getCategories);
router.get('/secteurs', userController.getSecteurs);
router.get('/secteurs/:secteurId', userController.getSecteurById);
router.get('/secteurs/:secteurId/categories', userController.getCategoriesBySecteur);

// Then routes with params
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, uploadMiddleware, userController.createUser); 
router.put('/:id', auth, uploadMiddleware, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;