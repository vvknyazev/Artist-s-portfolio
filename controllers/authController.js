const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require("../config");
const Picture = require("../models/Picture");

generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

class authController {
    async registration(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('registration', {message: 'Registration Error', color: 'alert-danger'});
        }

        const username = req.body.username;
        const password = req.body.password;

        const candidate = await User.findOne({username});
        if (candidate) {
            return res.render('registration', {message: 'Username already exists', color: 'alert-danger'});
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: 'USER'});
        const user = new User({username, password: hashPassword, roles: [userRole.value]});
        await user.save();
        res.render('registration', {message: 'User successfully registered', color: 'alert-success'});
    }

    async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        console.log(req.body);
        const user = await User.findOne({username});
        if (!user) {
            return res.render('login', {message: 'User not found', color: 'alert-danger'});
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.render('login', {message: 'Incorrect password', color: 'alert-danger'});
        }
        const token = generateAccessToken(user._id, user.roles);
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .redirect('/');
    }

    async getUsers(req, res) {

        const users = await User.find();
        res.json(users);
    }

    async getRegistration(req, res) {
        try {
            res.render('registration', {
                title: 'Registration Page'
            });
        } catch (e) {
            console.log(e);
        }
    }

    async getLogin(req, res) {
        try {
            res.render('login', {
                title: 'Registration Page'
            });
        } catch (e) {
            console.log(e);
        }
    }

    async logout(req, res) {
        try {
            return res
                .clearCookie("access_token")
                .status(200)
                .redirect('/');
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();