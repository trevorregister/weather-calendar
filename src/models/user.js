const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')

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

    token: String,
})

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id, role:this.role}, process.env.JWT_SECRET)
    return token
}

var User = mongoose.model('User', UserSchema)

module.exports = User



