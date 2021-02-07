var jwt = require('jsonwebtoken');
var secret = require('../config');

var authLibrary = {
    verifyToken: function (req, res, next) {
        console.log(req.headers);

        var bearerToken = req.headers['authorization'];


        if (!bearerToken || !bearerToken.includes('Bearer')) {
            res.status(401).send(`{"message":"Not authorized"}`);
        } else {
            var jwtToken = bearerToken.split("Bearer ")[1];
            //console.log(jwtToken);
            jwt.verify(jwtToken, secret.key, function (err, decoded) {
                if (err) {
                    res.status(401).send(`{"message":"Not authorized: Token invalid."}`);
                } else {
                    // assign role 
                    req.role = decoded.role;
                    next();
                }
            })

        }
    },

    verifyAdmin: function (req, res, next) {
        if (req.role == 'admin')
            next();
        else {
            res.status(401).send(`{"Message" : "Not Authorized. You're not admin."}`);
        }
    }
}
module.exports = authLibrary;