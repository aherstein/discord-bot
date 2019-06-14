const moment = require('moment')

module.exports = {
  currentTime: function () {
    return moment().format('YYYY-MM-DD HH:mm:SS Z')
  }
}