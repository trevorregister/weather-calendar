const User  = require ('../../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const env = require('../../config/env.json')

describe('user auth tokens', ()=> {

    test('generate and validate auth token', ()=>{
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            email: 'test@example.com',
            role: 'user',
            hash: '12345',
            calendar: {
                location: '/l/earth',
                id: '45667'
            }
        }
        var testUser = new User(payload)

        const token = testUser.generateAuthToken()
        const decoded = jwt.verify(token, env.JWT_SECRET)
        const match = {
            _id: payload._id,
            role: payload.role,
        }
        expect(decoded).toMatchObject(match)

        })
    })

    test('generate and reject invalid token', ()=>{
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            email: 'test@example.com',
            role: 'user',
            hash: '12345',
            calendar: {
                location: '/l/earth',
                id: '45667'
            }
        }
        var testUser = new User(payload)

        const token = testUser.generateAuthToken()

        const decoded = jwt.verify(token, 'fakeSecret', (err)=>{
            return err
    })

        var succeed
        decoded instanceof Error? succeed = false: succeed = true

        expect(succeed).toBe(false)
        
    })

