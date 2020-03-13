// Apply a callback function to the vinyl stream

const { Transform } = require('stream')

function apply (transformCallback = () => {}, flushCallback = () => {}) {
  function transform (file, encoding, callback) {
    try {
      transformCallback(file)
    } catch (error) {
      console.warn(error)
    }

    return callback(null, file)
  }

  function flush (callback) {
    try {
      flushCallback()
    } catch (error) {
      console.warn(error)
    }
  }

  return new Transform({ transform, flush, readableObjectMode: true, writableObjectMode: true })
}

module.exports = apply
