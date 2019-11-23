// Prepend files with text
// Unknown if this messes up sourcemaps

const { Transform } = require('stream')

function prepend (value = '') {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !value.length) {
      return callback(null, file)
    }

    file.contents = Buffer.concat([Buffer.from(value.toString()), file.contents])

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = prepend
