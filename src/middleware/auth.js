const jwt = require('jsonwebtoken')
const env = require('../../config/env.json')
const {api401, api403} = require('../utils/errors')

module.exports = function (req, res, next) {
    try {
        const token = req.cookies.authcookie
        if (!token) { throw new api401('no token') }

        const decoded = jwt.verify(token, env.JWT_SECRET)
        if(!decoded) { throw new api403('forbidden') }
        req.user = decoded
        next()

    }
    catch (err){
        next(err)
    }
}