const debug = require('debug')('bot:hi')
const moment = require('moment')
const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class Time extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'hi',
      aliases: [],
      group: 'misc',
      memberName: 'hi',
      description: 'Say hi!',
      details: oneLine`
      `,
      examples: ['hi'],
    })
  }

  async run (msg, args) {
    return msg.reply('Hello!!!!')
  }
}