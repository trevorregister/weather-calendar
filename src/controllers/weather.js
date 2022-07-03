const axios = require('axios')
const dotenv = require('dotenv').config()
const cheerio = require('cheerio')

exports.forecast = async function (req, res){
    const response = await axios.get('https://weather.com/weather/tenday/l/Marietta+GA?canonicalCityId=cbc1689619d2c1dd1ee27ff61e72b5ead7f7f24a76e15150d52b16224471599b')
    const $ = cheerio.load(response.data)
    const forecast = []

    for (let i = 0; i < 9; i++){
        let summary = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > p`).text()
        let temp = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > div > div:nth-child(1) > span`).text()
        let rainChance = $(`#detailIndex${i} > div > div.DailyContent--DailyContent--KcPxD > div > div.DailyContent--dataPoints--1Nya6 > div:nth-child(1) > span`).text()

        var weather = {
            dayIndex: i+1,
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

    //res.status(200).send(forecast)
    return forecast

}

/* const api_key = process.env.WEATHER_API_KEY
const location = {
    zip: '30066'
}
const days = '10'
const weatherHost = `${process.env.WEATHER_HOST}?key=${api_key}&q=${location.zip}&days=${days}&aqi=no&alerts=no` */


/* exports.longForecast = async function(req, res){
    try{
        const response = await axios.get(weatherHost)
        const responseForecast = response.data.forecast.forecastday
        var calendarForecast = []

        for (let day of responseForecast){
            let weather = {
                date: day.date,
                maxTemp: day.day.maxtemp_f,
                minTemp: day.day.mintemp_f,
                dailyChanceOfRain: day.day.daily_chance_of_rain,
                maxWind: day.day.maxwind_mph,
            }

            calendarForecast.push(weather)

        }
        res.status(200).send(calendarForecast)
        return calendarForecast

    }
    catch(error){return error}
    


} */


