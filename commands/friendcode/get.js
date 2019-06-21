const debug = require('debug')('bot:friendcode')
const db = require('../../db-operations')

const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class GetFriendCode extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'getfriendcode',
      aliases: [],
      group: 'friendcode',
      memberName: 'getfriendcode',
      description: 'Get a user\'s friend code.',
      details: oneLine`
      `,
      examples: ['getfriendcode @username'],

      args: [
        {
          key: 'user',
          label: 'User',
          prompt: 'Enter user name.',
          type: 'string',
          infinite: false
        }
      ]
    })
  }

  async run (msg, args) {
    try {
      const user = msg.mentions.users.first().id
      const friendcode = await db.getFriendCode(user)
      return msg.channel.send('Friend code for user ' + msg.mentions.users.first().username + ': ' + friendcode.friend_code)
    } catch (err) {
      debug(err.message)
      return msg.channel.send('I was not able to find a friend code for user ' + args.user + '!')
    }
  }
}