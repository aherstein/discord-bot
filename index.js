const {Client, Attachment} = require('discord.js')
const client = new Client()
const moment = require('moment')
const credentials = require('./credentials')
const axios = require('axios')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  let startTime = moment()
  let actualMessage = msg.content.replace(/^<.*> /g, '').toLowerCase()

  /** ping */
  if (actualMessage === 'ping') {
    msg.channel.send(moment().diff(startTime) + ' ms')
  }
})

client.login(credentials.bot)