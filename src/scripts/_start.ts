// Description:
//  Scripts that should be executed first.
//
// Author:
//  KeesCBakker

import "source-map-support/register"
import { start } from "../common/slack"
import { asciiArtChalker, chalker } from "chalk-with-markers"
import {
  removeTrailingWhitespaceCharactersFromIncommingMessages,
  removeTrailingBotWhitespaceCharactersFromIncommingMessages,
} from "hubot-command-mapper"

module.exports = async (robot: Hubot.Robot) => {
  // make sure command mapper behaves
  removeTrailingWhitespaceCharactersFromIncommingMessages(robot)
  removeTrailingBotWhitespaceCharactersFromIncommingMessages(robot)

  // setup adapters
  const adapters = start(process.env.HUBOT_SLACK_TOKEN)
  const info = await adapters.getBotInfo()

  // splash screen
  splash()

  // debug info
  console.log(
    chalker.colorize(`
[q]Bot name: [y]@${info.botName}
[q]App URL:  [y]${info.appUrl}

[g]Started!`)
  )
}

function splash() {
  console.log(
    asciiArtChalker.colorize(`
ppp__________        __    __________                    ppppp.___b.___ 
b\\______   \\ _____/  |_  \\____    /___________  bbb____   p|   b|   |
ww |    |  _//  _ \\   __\\   /     // __ \\_  __ \\/  _ \\  p|   b|   |
pp |    |   (  <_> )  |    pp/     /p\\  ___/|  | \\(  <_> ) p|   b|   |
b |______  /\\____/|__|   pp/_______b \\___  >__|   \\____/  p|___b|___|
www        \\/            w          \\/   \\/                        `)
  )
}
