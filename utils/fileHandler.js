let fs = require('fs');
const util = require('util');

const fileHandler = {
    getFileContent: async (path) => {
        const readFilePromise = util.promisify(fs.readFile);// make readFile a promise-based task to enhance code readability
        try {
            let content = await readFilePromise(path);
            return JSON.parse(content.toString("utf8"));
        } catch (e) {
            console.log(e);
            return e;
        }
    }
};
module.exports = fileHandler;
