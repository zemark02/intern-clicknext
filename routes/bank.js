const express = require('express');
const {addBankAccount,getBank,getBanks,deleteBank} = require('../controllers/bank');
const {protect} = require('../middlewares/auth')

const router = express.Router({mergeParams:true})

router.post('/addBankAccount',protect,addBankAccount);
router.get('/Bank/:id',protect,getBank)
router.get('/Banks',protect,getBanks)
router.delete('/Bank/:id',protect,deleteBank)

module.exports = router