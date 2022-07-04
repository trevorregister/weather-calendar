const User = require('../models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const saltRounds = 10
const { google } = require('googleapis')
const settings = require('../../settings.json')
const {api400, api401, api404} = require ('../utils/errors')


const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY = settings.private_key
const GOOGLE_CLIENT_EMAIL = settings.client_email
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER

exports.newUser = async function (req, res, next){
     try {
        var user = await User.findOne({"email":req.body.email.toLowerCase()})
        if (user) throw new api400(`${req.body.email} already exists`)

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
    catch (err){
        next(err)
    } 
}

exports.login = async function (req, res, next){
    try {
        const user = await User.findOne({"email":req.body.email.toLowerCase()})
        const match = await bcrypt.compare(req.body.password, user.hash)

        if(user && match){
            const token = user.generateAuthToken()
            res.cookie('authcookie', token, {httpOnly: true, maxAge: 300000})
            return res.status(200).send('login successful')
        }

        else throw new api401()
    }

    catch (err){
        next(err)
    }
}

exports.logout = async function (req, res, next){
    try {
        if(!req.cookies.authcookie) {
            throw new api400('no authcookie')
        }
        res.cookie('authcookie', '')
        return res.status(200).send('logged out')
    }
    catch(err) {
        next(err)
    }
}

exports.me = async function (req, res, next){
    try {
        let user = await User.find({"_id":req.user._id}).select('-hash')
        if(!user) { throw new api404(`${req.email} not found`) }
        return res.status(200).send(user)
    }
    catch(err) { next(err) }
}

exports.forecast = async function (req, res, next){

    try {  
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
        let client = await auth.getClient()

        switch (false){
            case user:
                throw new api404(`user not found`)
            case client:
                throw new errorsapi401('problem with google auth')
        }

        let weatherData = await user.getForecast()
        
        if(weatherData instanceof Error) { throw new errorsapi404('weather not found') } 

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
        next(err)
    }
}


