const passport = require('passport');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const user_register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('user create error', errors);
        res.send(errors.array());
    } else {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const params = [
            req.body.username,
            req.body.email,
            req.body.firstname,
            req.body.lastname,
            hash,
            2,
        ];
        if (await userModel.addUser(params)) {
            params[4] = "";
            res.json(params);
            next();
        } else {
            res.status(400).json({error: 'register error'});
        }
    }
};

const logout = (req, res) => {
    req.logout();
    res.json({message: 'logout'});
};

module.exports = {
    user_register,
    logout,
}