const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.get('/', auth, subcategoryController.getAllSubCategories);
router.get('/:id', auth, subcategoryController.getSubCategoryById);
router.post('/', auth, uploadMiddleware, subcategoryController.createSubCategory);
router.put('/:id', auth, uploadMiddleware, subcategoryController.updateSubCategory); 
router.delete('/:id', auth, subcategoryController.deleteSubCategory);

// Routes supplémentaires pour la gestion des relations
router.put('/:subcategoryId/assign', auth, subcategoryController.assignToCategory);
router.put('/:subcategoryId/unassign', auth, subcategoryController.unassignFromCategory);

module.exports = router;