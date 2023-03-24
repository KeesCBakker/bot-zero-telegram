import fs from "fs"
import { chalker } from "chalk-with-markers"

export function getConfig(envFilePath: string) {
  let defaultOptions = ["INSTALLED_TEAM_ONLY=true", "HUBOT_HELP_DISABLE_HTTP=true"]

  if (process.env.TS_NODE_DEV) {
    defaultOptions.push("ENVIRONMENT=local")
  }

  if (fs.existsSync(envFilePath)) {
    return fs
      .readFileSync(envFilePath, "utf-8")
      .split("\n")
      .filter(l => l && l.indexOf("=") !== -1 && l.indexOf("#") !== 0)
      .concat(defaultOptions)
  }

  return ["HUBOT_LOG_LEVEL=error"].concat(defaultOptions)
}

function errorAndExit(problem: string, details: string) {
  console.log()
  console.log(chalker.colorize("[y]" + problem + "[q] " + details))
  console.log()
  process.exit()
}

export function validateToken(config: string[]) {
  const envMsg = "your environment variables (for production) or to your .env file (for local development)."

  let token =
    config
      .map(x => x.split("="))
      .filter(x => x[0] == "TELEGRAM_TOKEN")
      .map(x => x[1].trim())
      .find(Boolean) || process.env.TELEGRAM_TOKEN

  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.substr(1, token.length - 2)
  }

  if (!token || token.length == 0) {
    errorAndExit("No TELEGRAM_TOKEN found.", "Please add it to " + envMsg)
  }

  return token
}

export function convertConfigIntoCrossEnvParameters(config: string[]) {
  const params = new Array<string>()

  config.forEach((c, index) => {
    c = c.trim()

    // should the parameter be quoted?
    if (c.indexOf(" ") !== -1 && c.indexOf('="') === -1) {
      c = c.replace("=", '="') + '"'
    }

    params.push(c)

    // add cross-env
    if (index !== config.length - 1) {
      params.push("cross-env")
    }
  })

  return params
}
