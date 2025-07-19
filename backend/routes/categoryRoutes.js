const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware'); 

router.get('/', categoryController.getAllCategories);
router.get('/:categoryId/subcategories', categoryController.getSubCategoriesByCategory);
router.get('/:id', categoryController.getCategorieById);
router.post('/', auth, uploadMiddleware, categoryController.createCategory); 
router.put('/:id', auth, uploadMiddleware, categoryController.updateCategory); 
router.delete('/:id', auth, categoryController.deleteCategory);
module.exports = router;