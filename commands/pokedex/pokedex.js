const axios = require('axios')
const debug = require('debug')('bot:pokedex')
const utils = require('../../util')
const querystring = require('querystring')
const Discord = require('discord.js')

const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class Pokedex extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'pokedex',
      aliases: ['pokédex'],
      group: 'pokedex',
      memberName: 'pokedex',
      description: 'Retrieve Pokédex info.',
      details: oneLine`
      `,
      examples: ['pokedex 448', 'pokedex lucario'],

      args: [
        {
          key: 'pokemon',
          label: 'Pokémon',
          prompt: 'Enter Pokémon name or number.',
          type: 'string',
          infinite: false
        }
      ]
    })
    this.pokedexBaseUri = 'https://pokeapi.co/api/v2/'
  }

  async run (msg, args) {
    try {
      const info = await this.info(args.pokemon)
      const spriteUrl = await this.sprite(args.pokemon)
      const sprite = new Discord.Attachment(spriteUrl)
      return msg.channel.send(info, sprite)
    } catch (err) {
      return msg.channel.send(err.message)
    }
  }

  /**
   * Formats a Pokémon info object into a string
   *
   * @param info Object
   * @returns {string}
   */
  formatInfo (info) {
    return '#' + info.id + ': ' + utils.toCapitalized(info.name) + '\n' +
      'Type: ' + utils.toCapitalized(info.type)
  }

  async info (pokemon) {
    try {
      const response = await axios.get(this.pokedexBaseUri + 'pokemon/' + querystring.escape((pokemon.trim().toLowerCase())))
      let data = response.data
      let info = {}
      info.id = data.id
      info.name = data.species.name
      info.type = ''
      data.types.forEach((type, index) => {
        info.type = info.type + type.type.name + ' '
      })

      return this.formatInfo(info)
    } catch (err) {
      debug(err)
      throw new Error('Sorry, I\'ve never heard of that Pokémon!')
    }
  }

  async sprite (pokemon) {
    try {
      const response = await axios.get(this.pokedexBaseUri + 'pokemon/' + querystring.escape(pokemon.trim().toLowerCase()))
      let data = response.data
      return data.sprites.front_default
    }
    catch (err) {
      debug(err)
      throw new Error('Sorry, I\'ve never heard of that Pokémon!')
    }
  }
}