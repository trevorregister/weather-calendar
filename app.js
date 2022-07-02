const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv').config()
const morgan = require('morgan')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT, ()=>console.log(`Listening on port ${process.env.PORT}...`))

const url = 'https://www.wunderground.com/weather/us/ga/marietta/30066'

async function test(){
    let page = await axios(url)
    const $ = cheerio.load(page)
    const selectedElem = '#inner-content > div.region-content-main > div:nth-child(1) > div > div:nth-child(1) > div > lib-forecast-chart > div > div > div > lib-forecast-chart-header-daily > div > div > div > div.forecast > a:nth-child(1) > div > span:nth-child(1) > span.temp-lo'
    console.log($)
    let keys = [
        'day1'
    ]


}
test()