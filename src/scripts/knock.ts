import { map_command } from "hubot-command-mapper"

module.exports = robot => {
  map_command(robot, "knock, knock", context => {
    context.res.reply("Who's there?")
  })
}
