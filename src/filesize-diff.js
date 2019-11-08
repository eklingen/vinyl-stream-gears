// Shows the difference before and after vinyl changes

const { Transform } = require('stream')
const { relative } = require('path')

// Starts tracking filesize
function start () {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    file.originalSize = file.contents.length

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

// Filter out files that haven't shrinked in size
// Slack is the amount of bytes it must have shrunk to count, so there's no fudging in the margins
function filter (options = { slack: 100 }) {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length || file.originalSize === undefined) {
      return callback(null, file)
    }

    if ((file.contents.length + options.slack) >= file.originalSize) {
      return callback()
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

// Reports savings to console
function report (options = { reportOnlyChanged: true }) {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || file.originalSize === undefined) {
      return callback(null, file)
    }

    if (!options.reportOnlyChanged || file.contents.length !== file.originalSize) {
      const filesizeString = `${(file.contents.length / 1024).toFixed(2)} KB`
      const difference = ((file.contents.length - file.originalSize) / 1024).toFixed(2)
      const differenceString = `${difference > 0 ? '+' : '-'}${difference} KB`

      console.log(''.padEnd(4), '\x1b[1m', relative(process.cwd(), file.path).padEnd(64), '\x1b[0m', filesizeString.padStart(12), '\x1b[2m(raw)\x1b[0m', differenceString.padStart(12), '\x1b[2m(difference)\x1b[0m')
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = { start, filter, report }
