const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogModel = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    body: {
        type: String,
        require: true,
        trim: true
    },
    authorId: {
        ref: "author",
        type: ObjectId,
        trim: true
    },
    tags: {
        type: [String],
        default: [],
        trim: true
    },
    category: {
        type: String,
        require: true,
        trim: true
    },
    subcategory: {
        type: [String],
        default: [],
        trim: true
    },
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    publishedAt: Date,
    isPublished: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true });

module.exports = mongoose.model("Blog", blogModel);