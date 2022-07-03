const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const weather_routes = require('./src/routes/weather')
const calendar_routes = require('./src/routes/calendar')
const user_routes = require('./src/routes/users')
const mongoose = require('mongoose')


const app = express()
mongoose.connect(process.env.MONGO_URI, ()=>console.log('Connected to database...'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/api/weather', weather_routes)
app.use('/api/calendar', calendar_routes)
app.use('/api/user', user_routes)

app.listen(process.env.PORT, ()=>console.log(`Listening on port ${process.env.PORT}...`))

