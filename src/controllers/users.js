const User = require('../models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const saltRounds = 10

exports.newUser = async function (req,res){
     try {
        var user = await User.findOne({"email":req.body.email.toLowerCase()})
        if (user) return res.status(400).send(`User with ${req.body.email} aleady exists`)

        const hash = await bcrypt.hash(req.body.password, saltRounds)

        var user = new User({
            email: req.body.email,
            role: 'user',
            hash: hash,
        })

        await user.save()
        const token = user.generateAuthToken()
        res.cookie('authcookie', token, {httpOnly: true, maxage: 300000})

        return res.status(201).send('User successfully created')
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