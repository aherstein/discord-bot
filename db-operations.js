const path = require('path')
const debug = require('debug')('bot:db-operations')
const moment = require('moment')
const sqlite = require('sqlite')

module.exports = {
  addDeletedMessage: async function (msg) {
    const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))
    const currentTime = moment().format('YYYY-MM-DD HH:mm:SS Z')
    return db.run('insert into deleted_messages(message_time, server, channel, user, message) values (?, ?, ?, ?, ?)',
      [currentTime, msg.guild.name, msg.member.displayName, msg.channel.name, msg.content])
  }

}