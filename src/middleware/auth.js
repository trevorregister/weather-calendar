const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const {api401, api403} = require('../utils/errors')

module.exports = function (req, res, next) {
    try {
        const token = req.cookies.authcookie
        if (!token) { throw new api401('no token') }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) { throw new api403('forbidden') }
        req.user = decoded
        next()

    }
    catch (err){
        next(err)
    }
}