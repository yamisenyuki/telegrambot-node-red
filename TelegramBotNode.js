
const Telegraf = require('telegraf')
const Config = require("./config")
const Telegram = require('telegraf/telegram')
const bot = new Telegraf(Config.Bot.token)
const rep = new Telegram(Config.Bot.token)

bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
})
bot.launch()
module.exports = function (RED) {
    function TelegramTextMessage(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        bot.on('text', (ctx, next) => {
            let msg = {}
            msg.payload = {}
            msg.payload.message = ctx.message
            msg.payload.chat = ctx.chat
            msg.payload.from = ctx.from
            msg.payload.inlineQuery = ctx.inlineQuery
            msg.payload.chosenInlineResult = ctx.chosenInlineResult
            msg.payload.shippingQuery = ctx.shippingQuery
            msg.payload.updateType = ctx.updateType
            msg.payload.updateSubTypes = ctx.updateSubTypes
            node.send(msg)
            next()
        })

    }
    function TelegramStartMessage(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        bot.on('text', (ctx, next) => {
            if (ctx.message.text === "/start") {
                let msg = {}
                msg.payload = {}
                msg.payload.message = ctx.message
                msg.payload.chat = ctx.chat
                msg.payload.from = ctx.from
                msg.payload.inlineQuery = ctx.inlineQuery
                msg.payload.chosenInlineResult = ctx.chosenInlineResult
                msg.payload.shippingQuery = ctx.shippingQuery
                msg.payload.updateType = ctx.updateType
                msg.payload.updateSubTypes = ctx.updateSubTypes
                node.send(msg)
            }
            next()
            // rep.sendMessage((ctx.message.chat.id), '323')
            // // ctx.reply('123')
            // this.log(222)
        })
    }
    function TelegramSendTextMessage(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.on('input', function (msg, send, done) {
            try {
                node.log(msg)
                if (msg.reply === undefined) msg.reply = msg.payload.message.text
                node.log(msg.reply)
                node.log(msg.payload.chat.id)
                rep.sendMessage(msg.payload.chat.id, msg.reply)
                done()
            } catch (error) {
                done(error)
                node.error(error)
            }
        })

    }
    function TelegramCommandMessage(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        bot.on('text', (ctx, next) => {
            if (ctx.message.text[0] === '/') {
                let msg = {}
                msg.payload = {}
                msg.payload.message = ctx.message
                msg.payload.chat = ctx.chat
                msg.payload.from = ctx.from
                msg.payload.inlineQuery = ctx.inlineQuery
                msg.payload.chosenInlineResult = ctx.chosenInlineResult
                msg.payload.shippingQuery = ctx.shippingQuery
                msg.payload.updateType = ctx.updateType
                msg.payload.updateSubTypes = ctx.updateSubTypes
                msg.payload.command = ctx.message.text.substring(1)
                node.send(msg)
            }
            next()
            // rep.sendMessage((ctx.message.chat.id), '323')
            // // ctx.reply('123')
            // this.log(222)
        })
    }
    function TelegramInlineMessage(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        bot.inlineQuery(/.*/, (ctx, next) => {
            let msg = {}
            msg.payload = {}
            msg.payload.message = ctx.message
            msg.payload.chat = ctx.chat
            msg.payload.from = ctx.from
            msg.payload.inlineQuery = ctx.inlineQuery
            msg.payload.chosenInlineResult = ctx.chosenInlineResult
            msg.payload.shippingQuery = ctx.shippingQuery
            msg.payload.updateType = ctx.updateType
            msg.payload.updateSubTypes = ctx.updateSubTypes
            node.send(msg)
            next()
            // rep.sendMessage((ctx.message.chat.id), '323')
            // // ctx.reply('123')
            // this.log(222)
        })
    }
    RED.nodes.registerType("TextMessage", TelegramTextMessage);
    RED.nodes.registerType("StartMessage", TelegramStartMessage);
    RED.nodes.registerType("SendTextMessage", TelegramSendTextMessage);
    RED.nodes.registerType("CommandMessage", TelegramCommandMessage);
    RED.nodes.registerType("InlineMessage", TelegramInlineMessage);
}