let fs = require('fs');
const fileHandler = require('./fileHandler');

/**
 *
 *The Data manager module,it wraps the main methods responsible for
 * handling data in a specified data source.
 *
 */

const dataManager = {
    addUser: async (datasource, user) => {
        try {
            let {tokens} = await fileHandler.getFileContent(datasource);
            tokens.push(user);
            let newTokens = JSON.stringify({tokens});
            fs.writeFile(datasource, newTokens, 'utf8', err => console.log(err));
        } catch (e) {
            console.log(e);
            return e;
        }
    },
    getUserByEmail: async (email, datasource) => {
        try {
            let {tokens} = await fileHandler.getFileContent(datasource);
            return tokens.find(user => user.email === email); // return undefined if the user not exist
        } catch (e) {
            console.log(e);
            return e;
        }
    },
    getUserByAPIKEY: async (api_key, datasource) => {
        try {
            let {tokens} = await fileHandler.getFileContent(datasource);
            return tokens.find(user => user.API_KEY === api_key);
        } catch (e) {
            console.log(e);
            return e;
        }
    },
    updateRateLimit: async (user, count, datasource) => {
        try {
            let {tokens} = await fileHandler.getFileContent(datasource);
            tokens.map((u) => {
                if (u.email === user.email) return u.rateLimit -= count;
            });
            let newTokens = JSON.stringify({tokens});
            fs.writeFile(datasource, newTokens, 'utf8', err => console.log(err));
        } catch (e) {
            console.log(e);
            return e;
        }
    },
    resetDailyRateLimit: async (datasource) => {
        try {
            let {tokens} = await fileHandler.getFileContent(datasource);
            tokens.map((u) => {
                return u.rateLimit = 80000;
            });
            let newTokens = JSON.stringify({tokens});
            fs.writeFile(datasource, newTokens, 'utf8', err => console.log(err));
        } catch (error) {
            console.error(error);
            return error;
        }
    }
};
module.exports = dataManager;