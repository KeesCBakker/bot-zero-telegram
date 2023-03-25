import { IContext } from "hubot-command-mapper"
import TelegramBot, { SendMessageOptions, EditMessageTextOptions } from "node-telegram-bot-api"

class Message {
  constructor(
    public chatId: string,
    public text: string,
    public options?: SendMessageOptions | EditMessageTextOptions
  ) {}
}

function isEditOption(item: SendMessageOptions | EditMessageTextOptions): item is EditMessageTextOptions {
  if ((item as EditMessageTextOptions)?.message_id) {
    return true
  }
  return false
}

async function execute<T>(fn: () => Promise<T>) {
  while (true) {
    try {
      return await fn()
    } catch (ex) {
      let msg = ex.message
      if (msg) {
        let regex = /429 Too Many Requests: retry after (\d+)/
        if (regex.test(msg)) {
          let matches = regex.exec(msg)
          let ms = parseInt(matches[1]) * 1000
          console.log("Rate limited, waiting", ms)
          await delay(ms)
          continue
        }
      }

      throw ex
    }
  }
}

async function sendMessage(api: TelegramBot, msg: Message) {
  if (msg.options != null && isEditOption(msg.options)) {
    var options = msg.options
    await execute(() => api.editMessageText(msg.text, options))
    return msg.options.message_id
  }

  var message = await execute(() => api.sendMessage(msg.chatId, msg.text, msg.options))
  return message.message_id
}

function isString(x: any): x is string {
  return typeof x === "string"
}

export class UpdatableMessage {
  private message?: Message | string
  private nextMessage?: Message | string
  private sending?: Promise<void>
  private isSending = false

  constructor(private readonly api: TelegramBot, private chatId: string, private messageId: number) {}

  async wait(): Promise<number | null> {
    if (this.sending) {
      await this.sending
      await delay(500)
    }

    return this.messageId
  }

  async send(msg: string | Message): Promise<void> {
    // don't send empty or the same message
    if (!msg || msg === this.message) {
      return
    }

    // when sending, add to later
    if (this.isSending) {
      this.nextMessage = msg
      await Promise.resolve(this.sending)
      return
    }

    // save orignal message for comparison
    this.message = msg

    if (isString(msg)) {
      msg = new Message(this.chatId, msg, <SendMessageOptions>{
        parse_mode: "Markdown",
      })
    }

    // check if we're doing an update
    if (this.messageId) {
      msg.options = <EditMessageTextOptions>{
        chat_id: this.chatId,
        message_id: this.messageId,
        parse_mode: "Markdown",
      }
    }

    this.isSending = true
    this.sending = sendMessage(this.api, msg).then(messageId => {
      this.messageId = this.messageId || messageId
      this.isSending = false

      const msg = this.nextMessage
      this.nextMessage = null
      return this.send(msg)
    })

    await this.sending
  }

  getMesssageId() {
    return this.messageId
  }

  getChatId() {
    return this.chatId
  }

  async delete() {
    // wait for last message to complete
    let messageId = await this.wait()

    // reset any updates
    this.messageId = null

    // delete this message
    await this.api.deleteMessage(this.chatId, messageId)
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(r => {
    setTimeout(() => {
      r()
    }, ms)
  })
}

export function createUpdatableMessage(chatId: string | IContext) {
  let id = ""

  if (isString(chatId)) {
    id = chatId
  } else {
    id = chatId.res.message.room
  }

  return new UpdatableMessage(createTelegramApi(), id, null)
}

function createTelegramApi() {
  const token = process.env.TELEGRAM_TOKEN
  const bot = new TelegramBot(token, { polling: false })
  return bot
}
