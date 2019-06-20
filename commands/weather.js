const credentials = require('../credentials')
const moment = require('moment')
const axios = require('axios')
const debug = require('debug')('bot:weather')

module.exports = {
  darkSkyBaseUri: 'https://api.darksky.net/forecast/' + credentials.darksky + '/',
  bingMapsBaseUri: 'http://dev.virtualearth.net/REST/v1/Locations?key=' + credentials.bingmaps + '&',

  /**
   *
   * @param location string
   * @returns {Promise<Object>} {
          lat: lat,
          long: long,
          name: name
        }
   */
  geoCode: async function (location) {
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

  },

  isItRaining: async function (location) {
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
  },

  forecast: async function (location) {
    try {
      const geo = await this.geoCode(location)
      const response = await axios.get(this.darkSkyBaseUri + geo.lat + ',' + geo.long)
      return 'Forecast for ' + geo.name + ': ' + response.data.minutely.summary + ' ' + response.data.hourly.summary + ' ' + response.data.daily.summary + ' '
    } catch (err) {
      debug(err)
      return 'Sorry, I don\'t understand the location ' + location + '!'
    }
  }
}