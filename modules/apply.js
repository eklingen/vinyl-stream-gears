// Apply a callback function to the vinyl stream

const { Transform } = require('stream')

function apply (transformCallback = () => {}) {
  function transform (file, encoding, callback) {
    transformCallback(file)

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = apply
