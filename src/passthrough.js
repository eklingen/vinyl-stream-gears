// Passthrough files without modification
// Useful to allow if/else logic within streams

const { PassThrough } = require('stream')

function passthrough () {
  return new PassThrough()
}

module.exports = passthrough
