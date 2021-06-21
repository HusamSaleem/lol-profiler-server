const Joi = require('joi');
const cors = require('cors'); // Enable cross-origin-requests
const express = require('express');
const app = express();
const league = require('./league');

app.use(express.json());
app.use(cors());

app.get('/api/summoner/info/all/:name', async (req, res) => {
    const {error} = validateNameSchema(req.params.name.toString());

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let playerInfo = await league.getAllSummonerInfo(req.params.name);

    if (!playerInfo || playerInfo == null || playerInfo['id'] == null) {
        res.status(400).send("Invalid League Name");
        return;
    }

    res.json(playerInfo);
});

app.get('/api/summoner/info/profile/:name', async (req, res) => {
    const {error} = validateNameSchema(req.params.name.toString());

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let playerInfo = await league.getSummonerProfile(req.params.name);

    if (!playerInfo || playerInfo == null) {
        res.status(400).send("Invalid League Name");
        return;
    }

    res.json(playerInfo);
});

// For any invalid url that that client goes to, give them a 404
app.all('*', (req, res) => {
    res.status(404).json({
        error: "This api call does not exist",
        status: 404
    });
});

function validateNameSchema(name) {
    const validScheme = Joi.string().min(3).max(16).required();
    return validScheme.validate(name);
}

// Listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));