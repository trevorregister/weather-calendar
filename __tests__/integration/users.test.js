const request = require('supertest')
const User = require('../../src/models/user')
const users = require('../data/users.json')

let server = require('../../app')

describe ('/api/users/', ()=>{
    beforeEach( async () => { 
        server = require('../../app') 
        await User.deleteMany({}) 
    })
    afterEach( async () => { server.close })

     describe('POST /', () => {

        it('create a new user', async () => {
            await request(server)
            .post('/api/users/register')
            .send(users.valid)
        
            var found = await User.findOne({"email": users.valid.email})

            expect(found).toBeTruthy()
        })

        it('reject new user as already existing', async () => {
            var dupes = [users.valid, users.valid]
            for await (let user of dupes){
                var res = await request(server)
                .post('/api/users/register')
                .send(user)
            }

            var found = await User.findOne({email: users.valid.email})

            expect(found).toBeTruthy()
            expect(res.statusCode).toBe(400)
        })

        it('login existing user w/ valid credentials', async () => {
            var credentials = {email: users.valid.email, password: users.valid.password}

            await request(server)
            .post('/api/users/register')
            .send(users.valid)

            var res = await request(server)
            .post('/api/users/login')
            .send(credentials)
        
            expect(res.status).toBe(200)
            expect(res.headers['set-cookie'][0].length).toBeGreaterThan(12)
    })

        it('reject login w/ invalid credentials', async () => {
            var credentials = {email: users.valid.email, password: 'not the password'}

            await request(server)
            .post('/api/users/register')
            .send(users.valid)

            var res = await request(server)
            .post('/api/users/login')
            .send(credentials)
        
            expect(res.statusCode).toBe(401)
        })

        it('log out a logged in user', async () => {
            var token = new User().generateAuthToken()

            await request(server)
            .post('/api/users/register')
            .send(users.valid)

            var res = await request(server)
            .post('/api/users/logout')
            .set('Cookie', `authcookie=${token}`)

            expect(res.headers['set-cookie'][0]).toMatch('authcookie=;')
        })

        it('post forecast to calendar', async () => {
            await request(server)
            .post('/api/users/register')
            .send(users.valid)

            var user = await User.findOne({"email": users.valid.email})
            var token = user.generateAuthToken()

            var res = await request(server)
            .get('/api/users/forecast')
            .set('Cookie', `authcookie=${token}`)
            expect(res.status).toBe(201)
        })

/*      Save this for when an admin auth route is written   
        it('reject logged in users invalid authorization', async () =>{
            await request(server)
            .post('/api/users/register')
            .send(users.valid)

            var res = await request(server)
            .get('/api/users/me')
            .set('Cookie', 'authcookie=invalidCookie')

            expect(res.statusCode).toBe(403)
        }) */

     })
})