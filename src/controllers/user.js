const User = require('../models/user')
const bcrypt = require('bcryptjs')
const saltRounds = 10

exports.newUser = async function (req,res){
     try {
        var user = await User.findOne({"email":req.body.email.toLowerCase()})
        if (user) {
            res.status(400).send(`User with ${req.body.email} aleady exists`)
            throw new Error(`User with ${req.body.email} aleady exists`)
        }

        const hash = await bcrypt.hash(req.body.password, saltRounds)

        var user = new User({
            email: req.body.email,
            role: 'user',
            hash: hash,
        })

        await user.save()
        return res.status(201).send('User successfully created')
    }
    catch (error){
        console.log(error)
    } 
}

exports.login = async function (req, res){
    try {
        const user = await User.findOne({"email":req.body.email.toLowerCase()})

        if(user && await bcrypt.compare(req.body.password, user.hash)){
            const token = user.generateAuthToken()
            res.status(200).header('x-auth-token', token).send(user)
        }

        else return res.status(401).send('Username or password incorrect')
    }

    catch (error){
        return error
    }
}

exports.me = async function (req, res){
    let user = await User.find({"_id":req.user._id}).select('-hash')
    return res.status(200).send(user)
}