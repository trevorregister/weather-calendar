const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const weather_routes = require('./src/routes/weather')
const calendar_routes = require('./src/routes/calendar')
const user_routes = require('./src/routes/user')
const mongoose = require('mongoose')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/api/weather', weather_routes)
app.use('/api/calendar', calendar_routes)
//app.use('/api/user', user_routes)

app.listen(process.env.PORT, ()=>console.log(`Listening on port ${process.env.PORT}...`))

