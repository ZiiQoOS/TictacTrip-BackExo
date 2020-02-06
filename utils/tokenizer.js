const uuidv4 = require('uuid/v4');
/**
 *
 * Token generation service , built with a uuid v4 module
 *
 * @type {{generateToken: (function(): string)}}
 */
const tokenizer = {
    generateToken: () => {
        return uuidv4().replace(/-|\s/g, "").toUpperCase(); // Generate a unique random uuid v4 and use it as an API KEY after removing hyphens
    }
};
module.exports = tokenizer;