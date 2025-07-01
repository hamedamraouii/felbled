const express=require('express');
const router = express.Router();
const gouvernoratController=require('../controllers/gouvernoratController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');


router.post('/', auth, uploadMiddleware, gouvernoratController.createGouvernorat);
router.get('/',auth,gouvernoratController.getAllGouvernorats);
router.get('/:id',auth,gouvernoratController.getGouvernoratById);
router.put('/:id',auth,uploadMiddleware,gouvernoratController.updateGouvernorat);
router.delete('/:id',auth,gouvernoratController.deleteGouvernorat);



module.exports=router;