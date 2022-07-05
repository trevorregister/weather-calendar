const mongoose = require('mongoose')
const env = require('./env.json')

async function connect(environment){
    switch (environment){
        case 'dev':
            var uri = env.DB
            break
        case 'test':
            var uri = env.TEST_DB
            break
    }

    var connection = await mongoose.connect(uri)
    console.log(`Connected to ${connection.connections[0].name}`)
    return connection.name
} 

module.exports = {connect}