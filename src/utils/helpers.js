const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    console.log("salt:", salt);
    return await bcrypt.hash(password, salt);
}

module.exports = {hashPassword};
