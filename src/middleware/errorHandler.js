const api404 = require('../utils/errors').api404
function returnError (err, req, res, next) {
    console.log(err.statusCode || 500, err.name)
    res.status(err.statusCode || 500).send(err.name)
   }

   module.exports = {
    returnError
   }