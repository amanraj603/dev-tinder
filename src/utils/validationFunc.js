const validator = require("validator");

const valideteSignupData = (req) => {
    const {firstName, emailId, password} = req.body;

    if(!firstName || !emailId || !password){
        throw new Error("Required fields are missing");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}

module.exports = valideteSignupData;