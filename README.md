# bot-zero telegram edition

<a href="https://hubot.github.com/">Hubot</a> is a fantastic project that enabled us to build great bots. The **bot-zero** project aims to give you a cleaned up version with some examples that run on TypeScript (instead of Coffee-script).

[![Build Status](https://travis-ci.org/wehkamp/bot-zero.svg?branch=master)](https://travis-ci.org/wehkamp/bot-zero)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/wehkamp/bot-zero/blob/master/LICENSE.md)

Blog: https://medium.com/wehkamp-techblog/jump-starting-slack-bot-projects-bot-zero-991b9654585e

## Getting started

Starting this project is really easy:

1. Fork this project (top right corner)
2. Clone your forked project to your pc.
3. Goto the @BotFather, ask for a token
4. Copy `.example.env` to `.env` and add the Telegram token to this file.
5. Open a terminal and navigate to your bot directory.
6. Enter `npm install` to install the NodeJs packages.
7. Start the bot using `npm run dev`.
8. Enjoy!

## Good to know

**Dev**<br/>
Start the bot with `npm run dev`. It will start a watcher that will inspect your typescript files. Whenever something is changed, the bot is restarted.
Add new scripts to the `src/scripts` directory. Every script have the following:

```js
module.exports = robot => {
  // your code goes here
}
```

**Docker**<br/>
If you want to run in Docker, execute the following:

```sh
docker build -t bot-zero .
docker run -e TELEGRAM_TOKEN=your-token-here -it bot-zero
```

**Packages** <br/>
We've included some packages:

- `node-fetch`: a modern HTTP client. Makes it easier to use promises of your HTTP requests.
- `cross-env`: allows you to store environment variables in the .env file in the root of the project.
- `hubot-command-mapper`: allows for the mapping of commands with parameters to the Hubot without the need for regular expressions.

## Tech

We're using the following stack:

- [x] NodeJs
- [x] TypeScript
- [x] Hubot
- [x] NPM
