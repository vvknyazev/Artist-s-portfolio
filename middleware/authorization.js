const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json({message: "User is not authorized"});
    }
    try {
        const data = jwt.verify(token, secret);
        req.userId = data.id;
        req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.access_token;

    if (token) {
        jwt.verify(token, secret, async (err, data) => {
            if (err) {
                res.locals.user = null;
                res.locals.admin = null;
            } else if (data.roles.includes('ADMIN')) {
                res.locals.admin = await User.findById(data.id).lean();
                res.locals.user = await User.findById(data.id).lean();
            } else {
                res.locals.user = await User.findById(data.id).lean();
            }
            next();
        });
    } else {
        res.locals.user = null;
        res.locals.admin = null;
        next();
    }
}
const checkAdmin = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json({message: "User is not authorized"});
    }
    if (token) {
        jwt.verify(token, secret, async (err, data) => {
            if (err) {
                res.locals.admin = null;
                next();
            } else {
                if (data.roles.includes('ADMIN')) {
                    res.locals.admin = await User.findById(data.id).lean();
                } else {
                    return res.status(403).json({message: "You are not an admin"});
                }
                next();
            }
        });
    } else {
        res.locals.admin = null;
        next();
    }

}

module.exports = {requireAuth, checkUser, checkAdmin};