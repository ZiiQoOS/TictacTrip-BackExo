const schedule = require('node-schedule');
const dataManager = require('./dataManager');
const {appconfig} = require('../appconfig');

/**
 * the module that schedules a job in specified time,based on the node-schedule module
 */
const resetLimitJob = {
    scheduleJob: (hour, minute) => {
        try {
            return schedule.scheduleJob({hour, minute}, async () => {
                    await dataManager.resetDailyRateLimit(appconfig.datasource);
                }
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    }
};
module.exports = resetLimitJob;