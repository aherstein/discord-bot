const path = require('path')
const debug = require('debug')('bot:db-operations')
const moment = require('moment')
const sqlite = require('sqlite')

module.exports = {
  addDeletedMessage: async function (msg) {
    const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))
    const currentTime = moment().format('YYYY-MM-DD HH:mm:SS Z')
    return db.run('insert into deleted_messages(message_time, server, channel, user, message) values (?, ?, ?, ?, ?)',
      [currentTime, msg.guild.name, msg.channel.name, msg.member.displayName, msg.content])
  },
  setFriendCode: async function (msg, friendcode) {
    const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))
    const currentTime = moment().format('YYYY-MM-DD HH:mm:SS Z')
    return db.run('insert into friend_codes(last_updated_time, user, friend_code) values (?, ?, ?) ' +
      'on conflict(user) do update set last_updated_time = ?, friend_code = ? where user = ?',
      [currentTime, msg.member.id, friendcode,
        currentTime, friendcode, msg.member.id])
  },
  getFriendCode: async function (user) {
    const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))
    const rows = await db.all('select friend_code from friend_codes where user = ?', user)
    return rows[0]
  }

}