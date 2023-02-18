const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const { validPassword, validMail, validName } = require('../validators/validator');

const createAuthor = async function (req, res) {
    try {
        const data = req.body;
        if (!Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter all required detials to register an author" });

        const { fname, lname, email, title, password, ...rest } = req.body;

        // Extra field validation --
        if (Object.keys(rest).length != 0) return res.status(400).send({ status: false, message: "please don't enter unwanted details" });

        // Required fields validation --
        if (!fname) return res.status(400).send({ status: false, message: "first name is required" });
        if (!validName(fname)) return res.status(400).send({ status: false, message: "please enter valid first name" });
        if (!lname) return res.status(400).send({ status: false, message: "last name is required" });
        if (!validName(lname)) return res.status(400).send({ status: false, message: "please enter valid last name" });
        if (!title) return res.status(400).send({ status: false, message: "title is required" });
        if (!["Mr", "Mrs", "Miss"].includes(title)) return res.status(400).send({ status: false, message: "please use a valid title" });
        if (!email) return res.status(400).send({ status: false, message: "email is required" });
        if (!validMail(email)) return res.status(400).send({ status: false, message: "please enter a valid email" });
        if (!password) return res.status(400).send({ status: false, message: "password is required" });
        if (!validPassword.validate(password)) return res.status(400).send({ status: false, message: "password must be strong, password must contain at least one upperCase, lowerCase, number, special charactoer and length must be 8 to 20" });

        // Unique fields validation --
        const author = await authorModel.findOne({ email: email });
        if (author) return res.status(409).send({ status: false, message: "email is already in use, please enter a unique email" });

        // Creating author's data on db -- 
        const authorCreated = await authorModel.create(data);
        res.status(201).send({ status: true, data: authorCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const loginAuthor = async function (req, res) {
    try {
        const data = req.body;
        if (!Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter all required detials to register an author" });

        const { email, password, ...rest } = req.body;

        // Extra field validation --
        if (Object.keys(rest).length != 0) return res.status(400).send({ status: false, message: "please don't enter unwanted details" });

        // Required fields validation --
        if (!email) return res.status(400).send({ status: false, message: "email is required" });
        if (!validMail(email)) return res.status(400).send({ status: false, message: "please enter a valid email" });
        if (!password) return res.status(400).send({ status: false, message: "password is required" });

        // finding user on db using credentials -- 
        const author = await authorModel.findOne({
            email: email,
            password: password,
        });
        if (!author) return res.status(404).send({ status: false, message: "eamil or password incorrect." });

        // creating jsonwebtoken for logged-in author -- 
        const token = jwt.sign({
            userId: author._id,
            userNmae: author.fname,
        },
            "3d54df719042638032529cbbfd284995bca3c1d9c4cce67990421595e65d78e5"
        );

        // setting token in response header -- 
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: { token: token } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createAuthor, loginAuthor };