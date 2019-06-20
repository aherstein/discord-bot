const credentials = require('../credentials')
const moment = require('moment')
const axios = require('axios')
const debug = require('debug')('bot:pokedex')
const utils = require('../util')

module.exports = {
  pokedexBaseUri: 'https://pokeapi.co/api/v2/',

  /**
   * Formats a Pokémon info object into a string
   *
   * @param info Object
   * @returns {string}
   */
  formatInfo: function (info) {
    return '#' + info.id + ': ' + utils.toCapitalized(info.name) + '\n' +
      'Type: ' + utils.toCapitalized(info.type)
  },

  info: async function (pokemon) {
    try {
      const response = await axios.get(this.pokedexBaseUri + 'pokemon/' + pokemon)
      let data = response.data
      let info = {}
      info.id = data.id
      info.name = data.species.name
      info.type = ''
      data.types.forEach((type, index) => {
        info.type = info.type + type.type.name + ' '
      })

      if (info.id !== null && info.name !== null && info.type !== null) { // Building info object complete
        return this.formatInfo(info)
      }
    } catch (err) {
      debug(err)
    }
  },

  sprite: async function (pokemon) {
    try {
      const response = await axios.get(this.pokedexBaseUri + 'pokemon/' + pokemon)
      let data = response.data
      return data.sprites.front_default
    }
    catch (err) {
      debug(err)
    }
  }
}