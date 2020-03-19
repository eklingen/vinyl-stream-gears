// Apply a callback function to the vinyl stream

const { Transform } = require('stream')

function apply (transformCallback = () => {}, flushCallback = () => {}) {
  function transform (file, encoding, callback) {
    transformCallback(file)

    return callback(null, file)
  }

  function flush (callback) {
    flushCallback()
  }

  return new Transform({ transform, flush, readableObjectMode: true, writableObjectMode: true })
}

module.exports = apply
