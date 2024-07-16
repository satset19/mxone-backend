const movieController = require('../controllers/movieController')

const router = require('express').Router()

router.post('/midtrans-generate', movieController.payment)

module.exports = router