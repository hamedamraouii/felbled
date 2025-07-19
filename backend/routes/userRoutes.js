
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
router.post('/search', userController.searchUsers);

router.get('/governorats', userController.getGovernorats);
router.get('/categories', userController.getCategories);

router.get('/subcategories/:subcategoryId', userController.getUsersBySubCategory);
router.get('/secteurs', userController.getSecteurs);
router.get('/secteurs/:secteurId/categories', userController.getCategoriesBySecteur);
router.get('/secteurs/:secteurId/subcategories', userController.getSubCategoriesBySecteur);

router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.post('/', auth, uploadMiddleware, userController.createUser); 
router.put('/:id', auth, uploadMiddleware, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

// finally :id route at the end
router.get('/:id', userController.getUserById);

module.exports = router;