const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware'); 

router.get('/', auth, categoryController.getAllCategories);
router.get('/:id', auth, categoryController.getCategorieById);
router.post('/', auth, uploadMiddleware, categoryController.createCategory); 
router.put('/:id', auth, uploadMiddleware, categoryController.updateCategory); 
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;