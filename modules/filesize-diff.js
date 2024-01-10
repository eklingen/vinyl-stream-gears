// Shows the difference before and after vinyl changes

const { Transform } = require('stream')
const { relative } = require('path')

const COLUMNS = Math.min(process.stdout.columns || 80, 120)
const truncateDots = (text = '', max = 50) => (text.length > max ? `${text.substring(0, max / 2 - 1)}...${text.substring(text.length - (max / 2 - 2), text.length)}` : text)

// Starts tracking filesize
function start() {
  function transform(file, encoding, callback) {
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
function filter(options = { slack: 100 }) {
  function transform(file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length || file.originalSize === undefined) {
      return callback(null, file)
    }

    if (file.contents.length + options.slack >= file.originalSize) {
      return callback()
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

// Reports savings to console
function report(options = { reportOnlyChanged: true }) {
  function transform(file, encoding, callback) {
    if (!file.isBuffer() || file.originalSize === undefined) {
      return callback(null, file)
    }

    if (!options.reportOnlyChanged || file.contents.length !== file.originalSize) {
      const color = file.relative.endsWith('map') ? '\x1b[0m' : '\x1b[1m'
      const filesize = `${(file.contents.length / 1024).toFixed(2)} KB`
      const filesizeString = `\x1b[0m${color}${filesize.padStart(15)}\x1b[2m (size)`
      const diff = ((file.contents.length - file.originalSize) / 1024).toFixed(2)
      const diffsize = `${diff > 0 ? '+' : '-'}${diff} KB`
      const diffsizeString = `\x1b[0m${color}${diffsize.padStart(15)}\x1b[2m (diff)`
      const filenameLength = COLUMNS - 60
      const filenameString = truncateDots(relative(process.cwd(), file.path).padEnd(filenameLength), filenameLength)

      console.log(''.padEnd(4), color, filenameString, filesizeString, diffsizeString, '\x1b[0m')
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = { start, filter, report }
