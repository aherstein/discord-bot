# discord-bot

## Setup

`npm install`

Run database migrations: `npm run migrate`

## Credential Management
Tokens are stored in the following environment variables:
* `BOT_TOKEN`
* `DARKSKY_TOKEN`
* `BINGMAPS_TOKEN`

## How to invite your bot to your server
https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot

## Deployment to Heroku
1. Log into Heroku: `heroku login`
2. Deploy: `git push heroku master`
3. Scale down web: `heroku ps:scale web=0`
4. Scale up worker: `heroku ps:scale worker=1`
