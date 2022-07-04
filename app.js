const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const user_routes = require('./src/routes/users')
const web_routes = require('./src/routes/web')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middleware/errorHandler')


const app = express()
mongoose.connect(process.env.MONGO_URI, ()=>console.log('Connected to database...'))

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.get('/', web_routes)
app.use('/api/users', user_routes)
app.use(errorHandler.returnError)

app.listen(process.env.PORT, ()=>console.log(`Listening on port ${process.env.PORT}...`))

