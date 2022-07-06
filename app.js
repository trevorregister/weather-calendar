const express = require('express')
const axios = require('axios')
const morgan = require('morgan')
const user_routes = require('./src/routes/users')
const web_routes = require('./src/routes/web')
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middleware/errorHandler')
const env = require('./config/env.json')
const db = require('./config/db')
const path = require('path')

const app = express()

db.connect('dev')

app.set('view engine', 'html')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.get('/', web_routes)
app.get('/style.css', (req,res)=>{res.sendFile(path.join(__dirname+'/views/pages/style.css'))})
app.use('/api/users', user_routes)
app.use(errorHandler.returnError)

const server = app.listen(env.PORT, ()=>console.log(`Listening on port ${env.PORT}...`))

module.exports = server