const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const cheerio = require('cheerio')
const axios = require('axios')

const UserSchema = new Schema({

    email:{
        type:String,
        required:[true, 'email required'],
    },

    role:{
        type:String,
        required:[true, 'Role required'],
        enum: {
            values: ['user', 'admin'],
            message: `role must be 'user' or 'admin'`
        }
    },

    hash: {
        type: String,
        required: [true, 'Password required']
    },

    calendar: {
        location: {type: String},
        id: {type: String}
    },
})

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, role: this.role}, process.env.JWT_SECRET)
    return token
}

UserSchema.methods.getForecast = async function(){
    const baseUrl = 'https://www.weather.com/weather/tenday'
    const location = this.calendar.location
    var forecast = []
    
    try { var response = await axios.get(`${baseUrl}${location}`) }
    catch (err){ return err }

    const $ = cheerio.load(response.data)

    let city = $("#WxuDailyCard-main-a43097e1-49d7-4df7-9d1a-334b29628263 > section > h1 > span > span").text()

    for (let i = 0; i < 2; i++){
        let summary = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > p`).text()
        let temp = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > div > div:nth-child(1) > span`).text()
        let rainChance = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > div > div.DailyContent--dataPoints--1Nya6 > div:nth-child(1) > span`).text()

        var weather = {
            dayIndex: i,
            summary: summary,
            temp: {
                low: temp.substring(0,2),
                high: temp.substring(3,5)
            },
            rainChance: {
                day: rainChance.substring(0,2),
                night: rainChance.substring(3,5)
            }
        }
        forecast.push(weather)
    }

    return {city, forecast}
}

var User = mongoose.model('User', UserSchema)

module.exports = User



