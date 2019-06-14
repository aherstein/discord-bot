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
  geoCode: function (location) {
    return new Promise((resolve, reject) => {
      // Split city from state
      let address = location.split(' ')
      let params = '&maxResults=1'

      // Provide state to API if available
      if (address.length > 1) {
        let locality = address.slice(0, -1).join(' ')
        let adminDistrict = address[address.length - 1]
        debug('Getting weather data for %s, %s', locality, adminDistrict)
        params = params + '&locality=' + locality + '&adminDistrict=' + adminDistrict
      } else {
        debug('Getting weather data for %s', address[0])
        params = params + '&locality=' + address[0]
      }

      axios.get(this.bingMapsBaseUri + params).then(response => {
        if (response.data.resourceSets[0].resources.length === 0) {
          reject()
        } else {
          let geoData = response.data.resourceSets[0].resources[0]
          let lat = geoData.point.coordinates[0]
          let long = geoData.point.coordinates[1]
          let name = geoData.name

          let results = {
            lat: lat,
            long: long,
            name: name
          }

          resolve(results)
        }
      }).catch(err => {
        debug(err)
        reject()
      })
    })
  },

  isItRaining: function (location) {
    return new Promise((resolve, reject) => {
      this.geoCode(location).then(geo => {
        axios.get(this.darkSkyBaseUri + geo.lat + ',' + geo.long).then(response => {
          if (response.data.currently.icon === 'rain') {
            resolve('It is raining in ' + geo.name)
          } else {
            resolve('It is NOT raining in ' + geo.name)
          }
        }).catch(err => {
          debug(err)
          resolve('Sorry, I don\'t understand the location ' + location + '!')
        })
      }).catch(() => {
        resolve('Sorry, I don\'t understand the location ' + location + '!')
      })
    })
  }
}