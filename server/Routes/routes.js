const express = require('express');
const { homeRoute, getPosts, searchPosts, getAbout,getContact } = require('../../controller/controller');
const router = express.Router();


//Home Route
router.get('/',homeRoute);

//getting the post
router.get('/post/:id',getPosts);

//Searc Post
router.post('/search',searchPosts)   

//Get About Page
router.get('/about',getAbout);

//Get the Contact Us Page
router.get('/contact',getContact)

module.exports = router;