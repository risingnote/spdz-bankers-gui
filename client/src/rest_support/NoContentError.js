// Error to represent missing data when requested from SPDZ proxy.
function NoContentError(message) {
  this.name = 'NoContentError'
  this.message = message || 'No content found.'
  this.stack = (new Error()).stack
}
NoContentError.prototype = Object.create(Error.prototype)
NoContentError.prototype.constructor = NoContentError

export default NoContentError