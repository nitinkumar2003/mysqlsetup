// Function to check if a value is empty
const isEmpty = (value) => {
    if (value === undefined || value === null || value === "" || value === 0) {
      return true;
    }
    return false;
  };
  
  // Function to validate an object for empty fields
  const validateObject = (obj) => {
    for (const key in obj) {
      if (isEmpty(obj[key])) {
        return `${key} can't is empty`;
      }
    }
    return null; // Return null if there are no empty fields
  };
  
  // Function to validate a field using a regular expression
  const validateField = (value, regex) => {
    console.log(regex,"regex")
    if (!regex.test(value)) {
      return "Invalid field value";
    }
    return null; // Return null if the field value is valid
  };

  function validateJsonRegisterUser(json) {
    for (let key in json) {
        const value = json[key].value;
        const regex = json[key].regex;
        if (!regex.test(value)) {
            return `Invalid ${key}: ${value}`;
        }
    }
    return null; // Return null if all values pass the regex check
}
  
  module.exports = { isEmpty, validateObject, validateField,validateJsonRegisterUser};
  