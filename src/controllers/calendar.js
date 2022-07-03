const { google } = require('googleapis')
const dotenv = require('dotenv').config()
const settings = require('../../settings.json')
const weather = require('./weather')

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY = settings.private_key
const GOOGLE_CLIENT_EMAIL = settings.client_email
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.CALENDAR_ID

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
)

const auth = new google.auth.GoogleAuth({
    keyFile: './weather-calendar-key.json',
    scopes: SCOPES
})

const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

/* exports.events = async function (req, res){

    const settings = {
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    }

        const events = await calendar.events.list(settings)
        res.status(200).send(events)

} */

exports.forecastWeather = async function(req, res){
    const forecast = await weather.forecast()
    for (let day of forecast){
        var title = `${day.temp.low}\u00B0/${day.temp.high}\u00B0`
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

        const client = await auth.getClient()
        
        calendar.events.insert({
            auth: auth,
            calendarId: GOOGLE_CALENDAR_ID,
            resource: event
        })
    }
}