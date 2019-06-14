const {Client, Attachment} = require('discord.js')
const client = new Client()
const moment = require('moment')
const credentials = require('./credentials')
const axios = require('axios')
const debug = require('debug')('bot')
const winston = require('winston')

// Commands
const commandsTime = require('./commands/time')

const commandChar = '/'

/**
 * Strips command char and any mentions
 *
 * @param msg
 * @returns {Promise<string>}
 */
function formatMessage (msg) {
  return new Promise((resolve, reject) => {
    let re = new RegExp('\\' + commandChar, 'g')
    let actualMessage = msg.content.replace(re, '') // Remove command char
      .replace(/^<.*> /g, '') // Remove all mentions
      .toLowerCase()
    resolve(actualMessage)
  })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  let startTime = moment()

  if (msg.content.startsWith(commandChar)) {
    formatMessage(msg).then(actualMessage => {
      debug('%s @%s #%s %s', msg.guild.name, msg.member.displayName, msg.channel.name, actualMessage)

      /** ping */
      if (actualMessage === 'time') {
        msg.channel.send(commandsTime.currentTime())
      }

      /** ping */
      if (actualMessage === 'ping') {
        msg.channel.send(moment().diff(startTime) + ' ms')
      }
    })

  }
})

client.login(credentials.bot).catch((err) => {
  debug(err)
})