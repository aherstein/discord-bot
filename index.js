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
const Command = require('./command')

// Commands
const commandsTime = require('./commands/time')
const commandsWeather = require('./commands/weather')
const commandsPokedex = require('./commands/pokedex')

const darkSkyAttribution = new Discord.RichEmbed().setTitle('Powered by Dark Sky').setURL('https://darksky.net/poweredby/')

discord.on('ready', () => {
  debug('Logged in as %s!', discord.user.tag)
})

discord.on('message', msg => {
  let startTime = moment()

  const command = new Command(msg)

  if (command.isValid()) {
    debug('%s @%s #%s %s', msg.guild.name, msg.member.displayName, msg.channel.name, command.actualMessage)

    /** time */
    if (command.command === 'time') {
      msg.channel.send(commandsTime.currentTime())
    }

    /** weather */
    if (command.command === 'weather') {
      if (command.params[0] === 'raining') {
        commandsWeather.isItRaining(command.stringifiedParams()).then((message) => {
          msg.channel.send(message, darkSkyAttribution)
        })
      }
      if (command.params[0] === 'forecast') {
        commandsWeather.forecast(command.stringifiedParams()).then((message) => {
          msg.channel.send(message, darkSkyAttribution)
        })
      }
    }

    /** pokedex */
    if (command.command === 'pokedex' || command.command === 'pokédex') {
      if (command.params[0] === 'sprite') {
        const respond = async () => {
          try {
            const spriteUrl = await commandsPokedex.sprite(command.stringifiedParams())
            msg.channel.send(new Discord.Attachment(spriteUrl))
          } catch (err) {
            msg.channel.send(err.message)
          }

        }
        respond()

      } else { // info
        let pokemon = command.stringifiedParams(true)

        const respond = async () => {
          try {
            const info = await commandsPokedex.info(pokemon)
            const spriteUrl = await commandsPokedex.sprite(pokemon)
            const sprite = new Discord.Attachment(spriteUrl)
            msg.channel.send(info, sprite)
          } catch (err) {
            msg.channel.send(err.message)
          }

        }
        respond()

      }
    }

    /** ping */
    if (command.command === 'ping') {
      msg.channel.send(moment().diff(startTime) + ' ms')
    }
  }

})

discord.login(credentials.bot).catch((err) => {
  debug(err)
})