const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const auth = require('../middleware/auth')

router.post('/login', users.login)
router.post('/logout', users.logout)
router.post('/register', users.newUser)
router.get('/me', auth, users.me)

module.exports = router