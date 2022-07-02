const express = require('express')
const router = express.Router()
const calendar = require('../controllers/calendar')

router.post('/', calendar.forecastWeather)
//router.get('/', calendar.events)

module.exports = router