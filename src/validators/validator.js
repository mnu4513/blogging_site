const passwordValidator = require("password-validator");
const validPassword = new passwordValidator();
validPassword
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols();

const validMail = (mail) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

const validName = (name) => /^[a-zA-Z_ ]{3,20}$/.test(name);

module.exports = { validPassword, validMail, validName };