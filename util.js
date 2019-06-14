module.exports = {
  /**
   * Returns stringified parameter, stripping out the sub-command
   * @param params
   * @param noSubCommand boolean Specify this if you don't want to strip out the first param
   * @returns {string}
   */
  getStringifiedParams: function (params, noSubCommand = false) {
    if (noSubCommand) {
      return params.join(' ')
    } else {
      return params.splice(1).join(' ')
    }
  },

  toCapitalized: function (value) {
    let splitStr = value.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
  }
}