const credentials = require('./credentials')
const process = require('process')
const debug = require('debug')('bot')
const Commando = require('discord.js-commando')
const path = require('path')
const oneLine = require('common-tags').oneLine
const client = new Commando.Client({
  // owner: '583018764950437888',
  commandPrefix: process.env.COMMAND_CHAR
})

client
  .on('error', debug)
  .on('warn', debug)
  .on('debug', debug)
  .on('ready', () => {
    debug('Client ready; logged in as %s#%s (%s)', client.user.username, client.user.discriminator, client.user.id)
  })
  .on('disconnect', () => { debug('Disconnected!') })
  .on('reconnecting', () => { debug('Reconnecting...') })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return
    debug('Error in command %s:%s %s', cmd.groupID, cmd.memberName, err)
  })

client.registry
  .registerGroups([
    ['pokedex', 'Pokédex'],
    ['weather', 'Weather'],
    ['time', 'Time']
  ])
  .registerDefaults()
  // .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(credentials.bot)