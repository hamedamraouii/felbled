const express = require('express')
const router = express.Router()
const secteursController = require('../controllers/secteurController')
const multer = require('multer')
const upload = multer()

// CRUD Secteur
router.post('/', upload.single('image'), secteursController.createSecteur)
router.get('/', secteursController.getAllSecteurs)

router.get('/:secteurId', secteursController.getSecteurById)
router.put('/:secteurId', upload.single('image'), secteursController.updateSecteur)
router.delete('/:secteurId', secteursController.deleteSecteur)

// Category & Subcategory
router.post('/:secteurId/categories', upload.single('image'), secteursController.addCategoryToSecteur)
router.post('/categories/:categoryId/subcategories', upload.single('image'), secteursController.addSubCategoryToCategory)

module.exports = router