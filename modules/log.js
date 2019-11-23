// Log files in the stream to the console

const { Transform } = require('stream')
const { basename } = require('path')

function log (options = { logContents: false }) {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.path || (options.logContents && (!file.contents || !file.contents.length))) {
      return callback(null, file)
    }

    console.log(basename(file.path).padEnd(64), file.path, options.logContents ? file.contents.toString('utf8') : '')

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = log
