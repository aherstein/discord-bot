const credentials = require('./credentials')
const Discord = require('discord.js')
const discord = new Discord.Client()
const moment = require('moment')
const axios = require('axios')
const debug = require('debug')('bot')
const winston = require('winston')
const utils = require('./util')
const Postgres = require('pg')
const pg = new Postgres.Client()

// Commands
const commandsTime = require('./commands/time')
const commandsWeather = require('./commands/weather')
const commandsPokedex = require('./commands/pokedex')

const commandChar = '/'
const darkSkyAttribution = new Discord.RichEmbed().setTitle('Powered by Dark Sky').setURL('https://darksky.net/poweredby/')

/**
 * Strips command char and any mentions
 *
 * @param msg
 * @returns {Promise<string>}
 */
async function formatMessage (msg) {
  let re = new RegExp('\\' + commandChar, 'g')
  return msg.content.replace(re, '') // Remove command char
    .replace(/^<.*> /g, '') // Remove all mentions
    .toLowerCase()
}

/**
 * Returns command
 *
 * @param msg
 * @returns {Promise<string>}
 */
async function parseCommand (msg) {
  const actualMessage = await formatMessage(msg)
  return actualMessage.split(' ')[0]
}

/**
 * Returns array of command parameters
 *
 * @param msg
 * @returns {Promise<string[]>}
 */
async function parseParameters (msg) {
  const actualMessage = await formatMessage(msg)
  return actualMessage.split(' ').splice(1) // Remove first param as it's the command and return the rest as parameters
}

discord.on('ready', () => {
  debug('Logged in as %s!', discord.user.tag)
})

discord.on('message', msg => {
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
            if (params[0] === 'sprite') {
              commandsPokedex.sprite(utils.getStringifiedParams(params)).then((spriteUrl) => {
                msg.channel.send(new Discord.Attachment(spriteUrl))
              }).catch(() => {
                msg.channel.send('Sorry, I\'ve never heard of that Pokémon!')
              })
            } else { // info
              let pokemon = utils.getStringifiedParams(params, true)
              commandsPokedex.info(pokemon).then((info) => {
                commandsPokedex.sprite(pokemon).then((spriteUrl) => {
                  let sprite = new Discord.Attachment(spriteUrl)
                  msg.channel.send(info, sprite)
                }).catch(() => {
                  msg.channel.send('Sorry, I\'ve never heard of that Pokémon!')
                })
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

discord.login(credentials.bot).catch((err) => {
  debug(err)
})