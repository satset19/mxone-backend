const movieController = require('../controllers/movieController');
const router = require('express').Router()

router.get('/', movieController.getMovie)
router.get('/genre', movieController.getGenre)
router.get('/cart', movieController.getCart)
router.delete('/cart/:id', movieController.deleteCart)
router.post('/addToCart', movieController.addCart)
router.get('/recomendation', movieController.getRecomendation)
router.get('/:id', movieController.getDetailMovie)

module.exports = router