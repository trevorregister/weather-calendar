const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')

    if (!token) return res.status(401).send('Invalid credentials')

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

    }
    catch (error){
        res.status(400).send('Invalid token')
    }
}