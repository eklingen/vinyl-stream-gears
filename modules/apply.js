// Apply a callback function to the vinyl stream

const { Transform } = require('stream')

function apply (cb = () => {}) {
  function transform (file, encoding, callback) {
    try {
      cb(file)
    } catch (e) {
      //
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = apply
