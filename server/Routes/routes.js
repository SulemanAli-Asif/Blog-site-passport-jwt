const express = require('express');
const { homeRoute, getPosts, searchPosts, getAbout } = require('../../controller/controller');
const router = express.Router();
const Post=require('../model/Schema');


//Home Route
router.get('/',homeRoute);

//getting the post
router.get('/post/:id',getPosts);

//Searc Post
router.post('/search',searchPosts)   

//Get About Page
router.get('/about',getAbout);

module.exports = router;