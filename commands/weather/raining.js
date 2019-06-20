const credentials = require('../../credentials')
const axios = require('axios')
const debug = require('debug')('bot:weather')
const Discord = require('discord.js')

const commando = require('discord.js-commando')
const oneLine = require('common-tags').oneLine

module.exports = class Forecast extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'raining',
      aliases: ['isitraining'],
      group: 'weather',
      memberName: 'raining',
      description: 'Tell me if it\'s raining at a given location.',
      details: oneLine`
      `,
      examples: ['raining la'],

      args: [
        {
          key: 'location',
          label: 'Location',
          prompt: 'Enter location.',
          type: 'string',
          infinite: false
        }
      ]
    })

    this.darkSkyBaseUri = 'https://api.darksky.net/forecast/' + credentials.darksky + '/'
    this.bingMapsBaseUri = 'http://dev.virtualearth.net/REST/v1/Locations?key=' + credentials.bingmaps + '&'
    this.darkSkyAttribution = new Discord.RichEmbed().setTitle('Powered by Dark Sky').setURL('https://darksky.net/poweredby/')
  }

  async run (msg, args) {
    const message = await this.raining(args.location)
    msg.channel.send(message, this.darkSkyAttribution)
  }

  /**
   *
   * @param location string
   * @returns {Promise<Object>} {
          lat: lat,
          long: long,
          name: name
        }
   */
  async geoCode (location) {
    // Split city from state
    let address = location.split(' ')
    let params = '&maxResults=1'

    // Provide state to API if available
    if (address.length > 1) {
      let locality = address.slice(0, -1).join(' ')
      let adminDistrict = address[address.length - 1]
      debug('Geocoding %s, %s', locality, adminDistrict)
      params = params + '&locality=' + locality + '&adminDistrict=' + adminDistrict
    } else {
      debug('Geocoding %s', address[0])
      params = params + '&locality=' + address[0]
    }

    try {
      const response = await axios.get(this.bingMapsBaseUri + params)
      if (response.data.resourceSets[0].resources.length === 0) {
        return false
      } else {
        let geoData = response.data.resourceSets[0].resources[0]
        let lat = geoData.point.coordinates[0]
        let long = geoData.point.coordinates[1]
        let name = geoData.name

        return {
          lat: lat,
          long: long,
          name: name
        }
      }
    } catch (err) {
      debug(err)
      throw(err)
    }

  }

  async raining (location) {
    try {
      const geo = await this.geoCode(location)
      const response = await axios.get(this.darkSkyBaseUri + geo.lat + ',' + geo.long)
      if (response.data.currently.icon === 'rain') {
        return 'It is raining in ' + geo.name
      } else {
        return 'It is NOT raining in ' + geo.name
      }
    } catch (err) {
      debug(err)
      return 'Sorry, I don\'t understand the location ' + location + '!'
    }
  }
}