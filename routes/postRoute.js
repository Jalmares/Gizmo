'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const postController = require('../controllers/postController');
const passport = require('../utils/pass');

router.get('/:search', postController.get_all_post);

router.get('/:id', postController.get_post);

router.post('/', passport.authenticate('jwt', {session: false}),upload.single('post_file'), postController.add_post);

router.post('/liked', passport.authenticate('jwt', {session: false}) ,postController.get_liked);

router.post('/comment', passport.authenticate('jwt', {session: false}) , postController.add_comment);
//router.put('/', postController.update_post);

//router.delete('/:id', postController.delete_post);

module.exports = router;