// Description:
//  Scripts that should be executed first.
//
// Author:
//  KeesCBakker

import removeMarkDown from "remove-markdown"
import { asciiArtChalker, chalker } from "chalk-with-markers"
import "source-map-support/register"

import {
  removeTrailingWhitespaceCharactersFromIncommingMessages,
  removeTrailingBotWhitespaceCharactersFromIncommingMessages,
} from "hubot-command-mapper"
import Hubot from "hubot"
import { createTelegramApi } from "../common/telegram"

module.exports = async (robot: Hubot.Robot) => {
  // make sure command mapper behaves
  removeMarkdownFromInput(robot)
  removeTrailingWhitespaceCharactersFromIncommingMessages(robot)
  removeTrailingBotWhitespaceCharactersFromIncommingMessages(robot)

  const api = createTelegramApi()
  const me = await api.getMe()

  let name = [me.first_name, me.last_name].filter(x => x).join(" ")

  // splash screen
  splash()

  // debug info
  console.log(
    chalker.colorize(`
[q]Bot username: [y]@${me.username}
[q]Bot name:     [y]${name}

[g]Started!`)
  )
}

function splash() {
  console.log(
    asciiArtChalker.colorize(`
ppp__________        __    __________                    ppppp ___b ___c ___
b\\______   \\ _____/  |_  \\____    /___________  bbb____   p|   b|   c|   |
cc |    |  _//  _ \\   __\\   /     // __ \\_  __ \\/  _ \\  p|   b|   c|   |
pp |    |   (  <_> )  |    pp/     /p\\  ___/|  | \\(  <_> ) p|   b|   c|   |
b |______  /\\____/|__|   pp/_______b \\___  >__|   \\____/  p|___b|___c|___|
ccc        \\/            c          \\/   \\/                        

                   ---==[ TELEGRAM EDITION ]==---`)
  )
}

export function removeMarkdownFromInput(robot: Hubot.Robot) {
  if (!robot) throw "Argument 'robot' is empty."

  robot.receiveMiddleware((context, next, done) => {
    const text = context.response.message.text
    console.log(text)
    if (text) {
      let newText = removeMarkDown(text)
      if (text != newText) {
        context.response.message.text = newText
      }
    }

    next(done)
  })
}
