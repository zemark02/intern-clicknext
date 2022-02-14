const express = require('express');
const {register ,login,getMe, logout,loginPage} = require('../controllers/auth');
const {protect} = require('../middlewares/auth')

const router = express.Router({mergeParams:true})

router.post('/register',register);
router.post('/login',login).get('/login',loginPage).get('/logout',protect,logout);
router.get('/me',protect,getMe)
// router.get('/feed',feed)
 
module.exports = router