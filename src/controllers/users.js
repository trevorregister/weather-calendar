const User = require('../models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const saltRounds = 10
const { google } = require('googleapis')
const settings = require('../../settings.json')

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY = settings.private_key
const GOOGLE_CLIENT_EMAIL = settings.client_email
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.CALENDAR_ID

exports.newUser = async function (req,res){
     try {
        var user = await User.findOne({"email":req.body.email.toLowerCase()})
        if (user) return res.status(400).send(`User with ${req.body.email} aleady exists`)

        const hash = await bcrypt.hash(req.body.password, saltRounds)
        const location = req.body.location.slice( req.body.location.indexOf('/l'))

        var user = new User({
            email: req.body.email,
            role: 'user',
            hash: hash,
            calendar: {
                location: location,
                id: '8h2oositcsu3cndv8j22f4dkng@group.calendar.google.com'
            }
        })

        await user.save()
        const token = user.generateAuthToken()
        res.cookie('authcookie', token, {httpOnly: true, maxage: 300000})

        return res.status(201).send(`${user} - registration successful`)
    }
    catch (error){
        console.log(error)
    } 
}

exports.login = async function (req, res){
    try {
        const user = await User.findOne({"email":req.body.email.toLowerCase()})
        const match = await bcrypt.compare(req.body.password, user.hash)

        if(user && match){
            const token = user.generateAuthToken()
            res.cookie('authcookie', token, {httpOnly: true, maxAge: 300000})
            return res.status(200).send('login successful')
        }

        else return res.status(401).send('Invalid credentials')
    }

    catch (error){
        return res.status(500).send('server error')
    }
}

exports.logout = async function (req, res){
    try {
        if(!req.cookies.authcookie) return res.status(400).send('no auth cookie')
        res.cookie('authcookie', '')
        return res.status(200).send('logged out')
    }
    catch(error) {
        return res.status(500).send('server error')
    }
}

exports.me = async function (req, res){
    let user = await User.find({"_id":req.user._id}).select('-hash')
    return res.status(200).send(user)
}

exports.forecast = async function (req, res){
    const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY,
        SCOPES
    )
    
    const auth = new google.auth.GoogleAuth({
        keyFile: './settings.json',
        scopes: SCOPES
    })
    
    const calendar = google.calendar({
        version: 'v3',
        project: GOOGLE_PROJECT_NUMBER,
        auth: jwtClient
    })

    let user = await User.findOne({"_id": req.user._id})
    let weatherData = await user.getForecast()

    try {    
        await auth.getClient()
    }
    catch(err){
        return res.status(404).send(`${err.code}`)

    }
    try{
        for (let day of weatherData.forecast){
            var title = `${weatherData.city} - ${day.temp.low}\u00B0/${day.temp.high}\u00B0`
            var date = new Date(Date.now() + day.dayIndex * (3600 * 1000 * 24)).toISOString()
            var event = {
                'summary': title,
                'description': day.summary,
                'start': {
                    'date': date.substring(0, date.indexOf('T'))
                },
                'end': {
                    'date': date.substring(0, date.indexOf('T'))
                }
            }

            calendar.events.insert({
                auth: auth,
                calendarId: user.calendar.id,
                resource: event
            })
        }
        return res.status(201).send('forecast posted')
    }
    catch(err){
        return res.status(400).send(`${err}`)
    }
}


