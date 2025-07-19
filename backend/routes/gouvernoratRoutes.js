const express=require('express');
const router = express.Router();
const gouvernoratController=require('../controllers/gouvernoratController');
const auth = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');


router.post('/', auth, uploadMiddleware, gouvernoratController.createGouvernorat);
router.get('/',gouvernoratController.getAllGouvernorats);
router.get('/simple', async (req, res) => {
  try {
    const Gouvernorat = require('../models/governorat');
    const gouvernorats = await Gouvernorat.find({}, 'name image_url image delegations');
    res.json({ success: true, gouvernorats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/:id',gouvernoratController.getGouvernoratById);
router.put('/:id',auth,uploadMiddleware,gouvernoratController.updateGouvernorat);
router.delete('/:id',auth,gouvernoratController.deleteGouvernorat);



module.exports=router;