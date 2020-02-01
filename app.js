const express = require('express');
const bodyParser = require('body-parser');
const justify = require('./utils/justify');
const tokenizer = require('./utils/tokenizer');
const dataManager = require('./utils/dataManager');
const {appconfig} = require('./appconfig');
let port = process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send({
        message: `Welcome to Justify!\n Use the following routes to :
    -/api/token : Get a token.
    -/api/justify : Justify your text.`
    });
});

app.post('/api/token', async (req, res) => {
    let {email} = req.body;
    let user = await dataManager.getUserByEmail(email, appconfig.datasource); // waiting the promise to be resolved before returning the value of the method
    if (!!user) {
        res.send({message: 'This email is already exists'});
    } else {
        let API_KEY = tokenizer.generateToken();
        res.send({API_KEY});
        let user = {email, API_KEY, rateLimit: 80000};
        await dataManager.addUser(appconfig.datasource, user);
    }
});


app.post('/api/justify', async (req, res) => {

    let API_KEY = req.header('API_KEY');
    if (!API_KEY) {
        res.status(400).send({error: "You need an API_Key to access to the justification service"})
    } else {
        let user = await dataManager.getUserByAPIKEY(API_KEY, appconfig.datasource);
        if (!!user)
            if (req.is('text/plain') && user.rateLimit - req.body.length >= 0) {
                res.send(justify.justifyText(req.body, 80));
                await dataManager.updateRateLimit(user, req.body.length, appconfig.datasource);
            } else {    //checking the content type of the request before processing the body
                res.status(400).send({error: "Request body should be a plain text"});
            }
        else res.status(404).send({message: 'API Key not found'});
    }

});

if (port == null || port === "") port = appconfig.PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

