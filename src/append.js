// Append files with text
// Unknown if this messes up sourcemaps

const { Transform } = require('stream')

function append (value) {
  value = value.toString()

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !value.length) {
      return callback(null, file)
    }

    file.contents = Buffer.concat([file.contents || '', Buffer.from(value)])

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = append
