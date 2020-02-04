let fs = require('fs');
const util = require('util');

const dataManager = {
    addUser: async (datasource, user) => {
        const readFilePromise = util.promisify(fs.readFile);
        let content = await readFilePromise(datasource);
        let obj = JSON.parse(content.toString("utf8"));
        let {tokens} = obj;
        tokens.push(user);
        let json = JSON.stringify(obj);
        fs.writeFile(datasource, json, 'utf8', err => console.log(err));
    },
    getUserByEmail: async (email, datasource) => {
        const readFilePromise = util.promisify(fs.readFile); // convert the readFile from a callback based function to a promise
        let content = await readFilePromise(datasource);
        let obj = JSON.parse(content.toString("utf8"));
        let {tokens} = obj;
        return tokens.find(user => user.email === email); // return undefined if the user not exist
    },
    getUserByAPIKEY: async (api_key, datasource) => {
        const readFilePromise = util.promisify(fs.readFile);
        let content = await readFilePromise(datasource);
        let obj = JSON.parse(content.toString("utf8"));
        let {tokens} = obj;
        return tokens.find(user => user.API_KEY === api_key);
    },
    updateRateLimit: async (user, count, datasource) => {
        const readFilePromise = util.promisify(fs.readFile);
        let content = await readFilePromise(datasource);
        let obj = JSON.parse(content.toString("utf8"));
        let {tokens} = obj;
        tokens.map((u) => {
            if (u.email === user.email) return u.rateLimit -= count;
        });
        let json = JSON.stringify(obj);
        fs.writeFile(datasource, json, 'utf8', err => console.log(err));
    },
    resetDailyRateLimit: async (datasource) => {
        const readFilePromise = util.promisify(fs.readFile);
        let content = await readFilePromise(datasource);
        let obj = JSON.parse(content.toString("utf8"));
        let {tokens} = obj;
        tokens.map((u) => {
            return u.rateLimit = 80000;
        });
        let json = JSON.stringify(obj);
        fs.writeFile(datasource, json, 'utf8', err => console.log(err));
    }
};
module.exports = dataManager;