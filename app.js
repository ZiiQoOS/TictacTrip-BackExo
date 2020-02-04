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
app.get('/', (req, res) => {
    res.send({message: `Welcome to Justify!`});
});

app.post('/api/token', async (req, res) => {
    let {email} = req.body;
    if (email) {
        let user = await dataManager.getUserByEmail(email, appconfig.datasource); // waiting the promise to be resolved before returning the value of the method
        if (!!user) {
            res.send({message: 'This email is already exists', API_KEY: user.API_KEY});
        } else {
            let API_KEY = tokenizer.generateToken();
            res.send({API_KEY});
            let user = {email, API_KEY, rateLimit: 80000};
            await dataManager.addUser(appconfig.datasource, user);
        }
    } else res.status(404).send({message: 'Please send an email with the req body'});

});


app.post('/api/justify', async (req, res) => {
    let API_KEY = req.header('API_KEY');
    if (API_KEY && req.is('text/plain')) { //checking the content type of the request and the API_KEY before processing the body
        let user = await dataManager.getUserByAPIKEY(API_KEY, appconfig.datasource);
        if (!!user) {
            if (user.rateLimit >= req.body.length) {
                res.send(justify.justifyText(req.body, 80));
                await dataManager.updateRateLimit(user, req.body.length, appconfig.datasource);
            } else res.status(402).send({error: "Payment Required ! you've reached your daily limit."});
        } else res.status(404).send({message: 'API Key not found'});
    } else res.status(400).send({error: "Bad Request,No API Key found or the request body is not a plain text."})
});

if (port == null || port === "") port = appconfig.PORT;
resetLimitJob.scheduleJob(0, 0); // Schedule a daily job at 00:00 to increase the reset the API daily rate limit
app.listen(port, () => console.log(`Example app listening on port ${port}!`));