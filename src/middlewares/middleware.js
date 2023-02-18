const jwt = require('jsonwebtoken');
const blogModel = require('../models/blogModel');
const { isValidObjectId } = require('mongoose');

const authentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "You have to login first." });

        jwt.verify(
            token,
            "3d54df719042638032529cbbfd284995bca3c1d9c4cce67990421595e65d78e5",
            function (err, decodedToken) {
                if (err) return res.status(400).send({ status: false, msg: "Invalid token." });
                req.decodedToken = decodedToken;
                next();
            });
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    };
};

const authorisation = async function (req, res, next) {
    try {
        const decodedToken = req.decodedToken;
        const blogId = req.params.blogId;

        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId." });

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false });

        if (!blog) return res.status(404).send({ status: false, msg: "Blog not found." });

        if (decodedToken.userId != blog.authorId) return res.status(403).send({ status: false, msg: "Not authorised" });

        next();
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    };
};

module.exports = { authentication, authorisation };