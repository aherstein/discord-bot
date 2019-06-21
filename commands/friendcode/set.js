const debug = require('debug')('bot:friendcode')
const db = require('../../db-operations')

const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class SetFriendCode extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'setfriendcode',
      aliases: [],
      group: 'friendcode',
      memberName: 'setfriendcode',
      description: 'Set my friend code.',
      details: oneLine`
      `,
      examples: ['setfriendcode SW-1234-5678-9012'],

      args: [
        {
          key: 'friendcode',
          label: 'Friend Code',
          prompt: 'Enter friend code.',
          type: 'string',
          infinite: false
        }
      ]
    })
  }

  async run (msg, args) {
    try {
      const response = await db.setFriendCode(msg, args.friendcode)
      return msg.reply('Friend code set!')
    } catch (err) {
      debug(err.message)
      return msg.channel.send('Something went wrong!')
    }
  }
}