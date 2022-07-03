const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const auth = require('../auth')

router.post('/login', user.login)
router.post('/register', user.newUser)
router.get('/me', auth.auth, user.me)

module.exports = router