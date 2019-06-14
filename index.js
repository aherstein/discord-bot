const credentials = require('./credentials')
const {Client, Attachment, RichEmbed} = require('discord.js')
const client = new Client()
const moment = require('moment')
const axios = require('axios')
const debug = require('debug')('bot')
const winston = require('winston')
const utils = require('./util')

// Commands
const commandsTime = require('./commands/time')
const commandsWeather = require('./commands/weather')
const commandsPokedex = require('./commands/pokedex')

const commandChar = '/'
const darkSkyAttribution = new RichEmbed().setTitle('Powered by Dark Sky').setURL('https://darksky.net/poweredby/')

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

/**
 * Returns command
 *
 * @param msg
 * @returns {Promise<string>}
 */
function parseCommand (msg) {
  return new Promise((resolve, reject) => {
    formatMessage(msg).then(actualMessage => {
      resolve(actualMessage.split(' ')[0])
    })
  })
}

/**
 * Returns array of command parameters
 *
 * @param msg
 * @returns {Promise<string>}
 */
function parseParameters (msg) {
  return new Promise((resolve, reject) => {
    formatMessage(msg).then(actualMessage => {
      resolve(actualMessage.split(' ').splice(1)) // Remove first param as it's the command and return the rest as parameters
    })
  })
}

client.on('ready', () => {
  debug('Logged in as %s!', client.user.tag)
})


client.on('message', msg => {
  let startTime = moment()

  if (msg.content.startsWith(commandChar)) {
    formatMessage(msg).then(actualMessage => {
      debug('%s @%s #%s %s', msg.guild.name, msg.member.displayName, msg.channel.name, actualMessage)

      parseCommand(msg).then((command) => {

        /** time */
        if (command === 'time') {
          msg.channel.send(commandsTime.currentTime())
        }

        /** weather */
        if (command === 'weather') {
          parseParameters(msg).then((params) => {
            if (params[0] === 'raining') {
              commandsWeather.isItRaining(utils.getStringifiedParams(params)).then((message) => {
                msg.channel.send(message, darkSkyAttribution)
              })
            }
            if (params[0] === 'forecast') {
              commandsWeather.forecast(utils.getStringifiedParams(params)).then((message) => {
                msg.channel.send(message, darkSkyAttribution)
              })
            }
          })
        }

        /** pokedex */
        if (command === 'pokedex' || command === 'pokédex') {
          parseParameters(msg).then((params) => {
            if (params[0] === 'info') {
              let pokemon = utils.getStringifiedParams(params)
              commandsPokedex.info(pokemon).then((info) => {
                commandsPokedex.sprite(pokemon).then((spriteUrl) => {
                  let sprite = new Attachment(spriteUrl)
                  msg.channel.send(info, sprite)
                }).catch(() => {
                  msg.channel.send('Sorry, I\'ve never heard of that Pokémon!')
                })
              }).catch(() => {
                msg.channel.send('Sorry, I\'ve never heard of that Pokémon!')
              })
            }
            if (params[0] === 'sprite') {
              commandsPokedex.sprite(utils.getStringifiedParams(params)).then((spriteUrl) => {
                msg.channel.send(new Attachment(spriteUrl))
              }).catch(() => {
                msg.channel.send('Sorry, I\'ve never heard of that Pokémon!')
              })
            }
          })
        }

        /** ping */
        if (command === 'ping') {
          msg.channel.send(moment().diff(startTime) + ' ms')
        }
      })
    })

  }
})

client.login(credentials.bot).catch((err) => {
  debug(err)
})