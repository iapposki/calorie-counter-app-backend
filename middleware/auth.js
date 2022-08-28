const jwt = require('jsonwebtoken');
const {authSecret} = require('../config');

const authenticate = async (req, res, next) => {
    var {token = ""} = req.query;
    if (!token) {
        const authHeader = req.headers['authorization'];
        // authHeader will look like : Bearer <token>
        var token = authHeader && authHeader.split(' ')[1];
    }
    // console.log(token)
    if (!token) {return res.status(401).json({msg: 'Unauthorized'})}
    try {
        const {name, email, emailSecret, role} = jwt.verify(token, authSecret)
        // console.log(resp)
        // console.log(email, role)
        req.userDetails = {name, email, emailSecret, role}
        next();
    } catch (error) {
        console.log(error.stack)
        res.status(401).json({msg: 'Unauthorized'})
    }
}

module.exports = {authenticate}