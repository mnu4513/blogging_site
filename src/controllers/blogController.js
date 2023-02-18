const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { isValidObjectId } = require('mongoose');

// Blog creating handler -- 
const createBlog = async function (req, res) {
    try {
        const data = req.body;
        if (!Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter all required detials to register an author" });

        const { title, body, authorId, category, isPublished, ...rest } = req.body;
        // Extra fields validation -- 
        if (Object.keys(rest).length != 0) return res.status(400).send({ status: false, message: "please don't enter unwanted details" });

        // Required fields validation -- 
        if (!title) return res.status(400).send({ status: false, msg: 'title is required' });
        if (title.trim().length == 0) return res.status(400).send({ status: false, msg: 'title is invalid' });
        if (!body) return res.status(400).send({ status: false, msg: 'body is required' });
        if (body.trim().length == 0) return res.status(400).send({ status: false, msg: 'body is invalid' });
        if (!category) return res.status(400).send({ status: false, msg: 'category is required' });
        if (category.trim().length == 0) return res.status(400).send({ status: false, msg: 'category is invalid' });
        if (isPublished == true || isPublished == 'true') data.publishedAt = Date.now();
        if (!authorId) return res.status(400).send({ status: false, msg: 'authorId is required' });
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "authorId is invalid" });
        const authorDetails = await authorModel.findOne({ _id: authorId });
        if (!authorDetails) return res.status(404).send({ status: false, msg: 'author not found in collection with this authorId' });

        // Creating blog's data on db -- 
        const blogCreated = await blogModel.create(data);
        res.status(201).send({ status: true, data: blogCreated });
    } catch (error) {
        res.status(500).send({ status: false, msg: "invalid request" });
    };
};

// Get blog handler -- 
const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        const allBlogs = {};
        if (Object.keys(data).length == 0)
            allBlogs = await blogModel.find({ isDeleted: false, isPublished: true });
        allBlogs = await blogModel.find({ ...data, isDeleted: false, isPublished: true });
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: "no such blog found" });
        res.status(200).send({ status: true, data: allBlogs });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    };
};

// Update blog handler -- 
const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const data = req.body;
        let blog = {};
        if (data.isPublished == "true" || data.isPublished == true) {
            blog = await blogModel.findOneAndUpdate({ _id: blogId, isPublished: false, isPublished: false },
                {
                    isPublished: true,
                    title: data.title,
                    body: data.body,
                    $addToSet: { tags: data.tags, subcategory: data.subcategory },
                    category: data.category,
                    publishedAt: Date.now(),
                },
                { new: true }
            );
        } else if (data.isPublished == "true" || data.isPublished == true) {
            blog = await blogModel.findOneAndUpdate({ _id: blogId, isPublished: false, isPublished: true },
                {
                    isPublished: true,
                    title: data.title,
                    body: data.body,
                    $addToSet: { tags: data.tags, subcategory: data.subcategory },
                    category: data.category
                },
                { new: true }
            );
        } else {
            blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },
                {
                    title: data.title,
                    body: data.body,
                    $addToSet: { tags: data.tags, subcategory: data.subcategory },
                    category: data.category,
                },
                { new: true }
            );
        };

        if (!blog) return res.status(404).send({ status: false, msg: "No such blog exits" });
        return res.status(200).send({ status: true, data: blog });
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    };
};

// Delete blog handler (blogId in param) -- 
const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        const blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
        );

        if (!blog) return res.status(400).send({ status: false, msg: 'no such blog exists or alredy deleted' });
        res.status(200).send({ status: true, data: blog });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    };
};

// Delete blog by filteration -- 
const deleteBlogs = async function (req, res) {
    try {
        const decodedToken = req.decodedToken;
        const result = req.query;
        if (result.authorId && decodedToken.userId != result.authorId)
            return res.status(403).send({ status: false, msg: "You are not authorised." });
        const deleteBlog = await blogModel.updateMany(
            { ...result, isDeleted: false, authorId: decodedToken.userId },
            { $set: { isDeleted: true, deletedAt: Date.now() } }
        );
        if (deleteBlog.matchedCount == 0)
            return res.status(404).send({ status: false, msg: "data not found" });
        res.status(200).send({ status: true, data: deleteBlog });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    };
};

module.exports = { createBlog, getBlogs, updateBlog, deleteBlog, deleteBlogs };