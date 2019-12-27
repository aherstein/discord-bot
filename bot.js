const process = require('process')
const debug = require('debug')('bot')
const commando = require('discord.js-commando')
const path = require('path')
const oneLine = require('common-tags').oneLine
const sqlite = require('sqlite')
const db = require('./db-operations')
const client = new commando.Client({
  commandPrefix: process.env.COMMAND_CHAR
})

client
  .on('error', debug)
  .on('warn', debug)
  .on('debug', debug)
  .on('message', (msg) => {
    if (msg.content.startsWith(client.commandPrefix)) {
      debug('%s @%s #%s %s', msg.guild.name, msg.member.displayName, msg.channel.name, msg.content)
    }
  })
  .on('messageDelete', (msg) => {
    db.addDeletedMessage(msg).then(() => {
      debug('Stored deleted message: %s @%s #%s %s', msg.guild.name, msg.member.displayName, msg.channel.name, msg.content)
    }).catch((err) => {
      debug(err)
    })
  })
  .on('ready', () => {
    debug('Client ready; logged in as %s#%s (%s)', client.user.username, client.user.discriminator, client.user.id)
  })
  .on('disconnect', () => { debug('Disconnected!') })
  .on('reconnecting', () => { debug('Reconnecting...') })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return
    debug('Error in command %s:%s %s', cmd.groupID, cmd.memberName, err)
  })

client.setProvider(
  sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(debug)

client.registry
  .registerGroups([
    ['pokedex', 'Pokédex'],
    ['weather', 'Weather'],
    ['friendcode', 'Friend Code'],
    ['misc', 'Miscellaneous']
  ])
  .registerDefaults()
  // .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(process.env.BOT_TOKEN)
