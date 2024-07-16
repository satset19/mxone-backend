const router = require('express').Router()
let authentication = require('../middlewares/authentication');
const user = require('./userRoute');
const movie = require('./movieRoute');
const payment = require('./midtransRoute');

router.use('/', user)
router.use(authentication)
router.use('/movies', movie)
router.use('/payment', payment)



module.exports = router