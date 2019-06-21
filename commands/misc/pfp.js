const debug = require('debug')('bot:pfp')
const moment = require('moment')
const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class ProfilePic extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'pfp',
      aliases: [],
      group: 'misc',
      memberName: 'pfp',
      description: 'Get profile pic of user.',
      details: oneLine`
      `,
      examples: ['pfp @username'],
    })
  }

  async run (msg, args) {
    const user = msg.mentions.users.first()
    if (user.constructor.name !== 'ClientUser') { // Ignore self
      debug(user.avatarURL)
      return msg.channel.send(user.avatarURL)
    }
  }
}