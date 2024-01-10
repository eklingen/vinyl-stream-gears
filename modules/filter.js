// Filter files from the stream by file[xxx] property.
// Use: filter([ file => path.extname(file.relative) === '.map', ... ])

const { Transform } = require('stream')

function filter(filters = []) {
  function transform(file, encoding, callback) {
    if (!file.isBuffer() || !filters.length) {
      return callback(null, file)
    }

    for (const filter of filters) {
      if (filter(file)) {
        return callback()
      }
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = filter
