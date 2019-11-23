// Append files with text

const { Transform } = require('stream')

function append (value = '') {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !value.length) {
      return callback(null, file)
    }

    file.contents = Buffer.concat([file.contents, Buffer.from(value.toString())])

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = append
