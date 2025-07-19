const express = require('express');
const router = express.Router();
const delegationController = require('../controllers/delegationController');
const auth = require('../middlewares/authMiddleware'); // CORRIGÉ : avec 's' comme vos autres routes

router.get('/', delegationController.getAllDelegations);
router.get('/:id', delegationController.getDelegationById);
router.post('/', auth, delegationController.createDelegation);
router.put('/:id', auth, delegationController.updateDelegation);
router.delete('/:id', auth, delegationController.deleteDelegation);

module.exports = router;