const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

function validate(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) { res.status(401).json({message: "Invalid token."})}
            else {
                req.user = {username: decodedToken.username, user_id: decodedToken.user_id};
                next();
            }
        })
    } else {
        res.status(401).json({message: "Token required."});
    }
}

module.exports = validate;