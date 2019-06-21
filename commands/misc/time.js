const debug = require('debug')('bot:pokedex')
const moment = require('moment')
const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class Time extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'time',
      aliases: [],
      group: 'misc',
      memberName: 'time',
      description: 'Get current time.',
      details: oneLine`
      `,
      examples: ['time'],
    })
  }

  async run (msg, args) {
    return msg.channel.send(moment().format('YYYY-MM-DD HH:mm:SS Z'))
  }
}