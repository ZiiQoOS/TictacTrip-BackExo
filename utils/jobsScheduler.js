const schedule = require('node-schedule');
const dataManager = require('./dataManager');
const {appconfig} = require('../appconfig');


const resetLimitJob = {
    scheduleJob: (hour, minute) => {
        return schedule.scheduleJob({hour, minute}, async () => {
                await dataManager.resetDailyRateLimit(appconfig.datasource);
                console.log("Job Doone!");
            }
        );
    }
};

module.exports = resetLimitJob;