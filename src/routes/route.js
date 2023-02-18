const express = require('express');
const router = express.Router();

const {createAuthor, loginAuthor} = require('../controllers/authorController');
const {createBlog, getBlogs, deleteBlog, deleteBlogs, updateBlog} = require('../controllers/blogController');
const {authentication, authorisation} = require('../middlewares/middleware');

// Author's APIs -- 
router.post('/authors', createAuthor);
router.post('/login', loginAuthor);

// Blog's APIs -- 
router.post('/blogs', authentication, createBlog);
router.get('/blogs', getBlogs);
router.put('/blogs/:blogId', authentication, authorisation, updateBlog);
router.delete('/blogs/:blogId', authentication, authorisation, deleteBlog);
router.delete('/blogs', authentication, deleteBlogs);

// To handle all undefined end-points --
router.all('/*', function (req, res) {
    return res.status(404).send({status: false, message: 'page not found'});
});

module.exports = router;