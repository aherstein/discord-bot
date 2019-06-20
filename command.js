'use strict'
const process = require('process')

class Command {

  /**
   *
   * @param msg {Discord.Message}
   */
  constructor (msg) {
    this.commandChar = process.env.COMMAND_CHAR
    this._originalMessage = msg.content
    this._actualMessage = this.formatMessage(msg)
    this._command = this.parseCommand()
    this._params = this.parseParameters()
  }

  /**
   * Strips command char and any mentions
   *
   * @param msg
   * @returns {string}
   */
  formatMessage (msg) {
    let re = new RegExp('\\' + this.commandChar, 'g')
    return msg.content.replace(re, '') // Remove command char
      .replace(/^<.*> /g, '') // Remove all mentions
      .toLowerCase()
  }

  /**
   * Returns command
   *
   * @returns {string}
   */
  parseCommand () {
    return this.actualMessage.split(' ')[0]
  }

  /**
   * Returns array of command parameters
   *
   * @returns {string[]}
   */
  parseParameters () {
    return this.actualMessage.split(' ').splice(1) // Remove first param as it's the command and return the rest as parameters
  }

  /**
   * Checks if message starts with command character
   *
   * @returns {boolean}
   */
  isValid () {
    return this._originalMessage.startsWith(this.commandChar)
  }

  get actualMessage () {
    return this._actualMessage
  }

  get command () {
    return this._command
  }

  get params () {
    return this._params
  }
}

module.exports = Command