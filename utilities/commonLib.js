const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
let $Commonfun = {
    generateUuid: (email) => {
        const timestamp = Date.now();
        const uuidNamespace = `email:${email},time:${timestamp}`;
        return uuidv4({ namespace: uuidNamespace });
    },
    getHashPassword :(userPassword) => {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(userPassword, salt);
        return hash
    }
   
}
const regexCom={
    onlyString: /^[A-Za-z\s]+$/,
    emailRegex :/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordRegex : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

}


module.exports={regexCom,$Commonfun}