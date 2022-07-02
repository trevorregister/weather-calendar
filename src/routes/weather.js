const express = require('express')
const router = express.Router()
const weather = require('../controllers/weather')

router.get('/', weather.forecast)

module.exports = router