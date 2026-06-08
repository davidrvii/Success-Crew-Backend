const bcrypt = require("bcryptjs")

async function hashPassword(plainPassword){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plainPassword, salt)
}

async function comparedPassword(plainPassword, hashPassword){
    return bcrypt.compare(plainPassword, hashPassword)
}

module.exports={
    hashPassword,
    comparedPassword
}