const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res)=>{
    res.sendFile('C:/Users/trevo/Documents/Projects/weather-calendar/weather-calendar/views/pages/index.html')
})

router.get('/register', (req, res)=>{
    res.render('pages/register')
})


module.exports = router