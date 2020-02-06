const express = require('express');
const bodyParser = require('body-parser');
const justify = require('./utils/justify');
const tokenizer = require('./utils/tokenizer');
const dataManager = require('./utils/dataManager');
const resetLimitJob = require('./utils/jobsScheduler');
const {appconfig} = require('./appconfig');
let port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());

/**
 * the endpoint that
 */

app.get('/', async (req, res) => {
    let email = '';
    let user = await dataManager.getUserByEmail(email, appconfig.datasource); // waiting the promise to be resolved before returning the value of the method
    console.log(user);
    res.send({message: `Welcome to Justify!`});
});
/**
 * The endpoint that's responsible for generating a new token for a new user
 *
 */
app.post('/api/token', async (req, res) => {
    let {email} = req.body;
    let user;
    if (email) {
        try {
            user = await dataManager.getUserByEmail(email, appconfig.datasource); // waiting the promise to be resolved before returning the value of the method
        } catch (e) {
            console.log(e);
            res.send(e);
        }
        if (!!user) {
            res.status(302).send({message: 'This email is already exists', API_KEY: user.API_KEY});
        } else {
            let API_KEY = tokenizer.generateToken();
            let user = {email, API_KEY, rateLimit: 80000};
            await dataManager.addUser(appconfig.datasource, user);
            res.status(201).send({API_KEY});
        }
    } else res.status(404).send({message: 'Please send an email with the request body'});

});

/**
 * The main endpoint , used to justify a text sent in body of the request as a plain text
 *
 */

app.post('/api/justify', async (req, res) => {
    let API_KEY = req.header('API_KEY');

    if (API_KEY && req.is('text/plain')) { //checking the content type of the request and the API_KEY before processing the body
        let user = await dataManager.getUserByAPIKEY(API_KEY, appconfig.datasource); // get a user object by his unique API KEY
        if (!!user) {
            if (user.rateLimit >= req.body.length) {
                res.send(justify.justifyText(req.body, 80));
                await dataManager.updateRateLimit(user, req.body.length, appconfig.datasource);
            } else res.status(402).send({error: "Payment Required ! you've reached your daily limit."});
        } else res.status(404).send({message: 'API Key not found'});
    } else res.status(401).send({error: "Bad Request,No API Key found or the request body is not a plain text."})
});


/**
 * Check the if the post const if it was initialised by the process env variable;
 * if not , we need to init it using the number of a local free port
 */
if (port == null || port === "") port = appconfig.PORT;

/**
 * Schedule a daily job at midnight (00:00 AM) to reset the API daily rate limit for all users
 */
resetLimitJob.scheduleJob(0, 0);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));