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

const validData = (category) => {
    if (category.trim().length == 0) {
        return false;
    } else {
        return true;
    };
};



module.exports = { validPassword, validMail, validName, validData };