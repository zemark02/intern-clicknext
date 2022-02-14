const express = require('express');
const {withDraw,deposit,transfer,getTransactions} = require('../controllers/transaction');
const {protect} = require('../middlewares/auth')

const router = express.Router({mergeParams:true})

router.post('/withdraw/:id',protect,withDraw).post('/deposit/:id',protect,deposit).post('/transfer/:id',protect,transfer);
router.get('/transactions/:id',protect,getTransactions)
module.exports = router