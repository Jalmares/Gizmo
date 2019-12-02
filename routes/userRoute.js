'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.get_all_users);

router.get('/:id', userController.get_user);

router.post('/', userController.add_user);

router.put('/', (req, res) => {
    res.send('With this endpoint you can modify users.');
});

router.delete('/', (req, res) => {
    res.send('With this endpoint you can delete users.');
});

module.exports = router;
