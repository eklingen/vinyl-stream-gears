// Reports the filesize (plain and gzipped) of files in the stream

const { gzipSync } = require('zlib')
const { relative } = require('path')
const { Transform } = require('stream')

const DEFAULT_OPTIONS = {
  showRaw: true,
  showGzip: true
}

const COLUMNS = Math.min(process.stdout.columns || 80, 120)
const truncateDots = (text = '', max = 50) => (text.length > max) ? `${text.substring(0, ((max / 2) - 1))}...${text.substring(text.length - ((max / 2) - 2), text.length)}` : text

function filesize (options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    const rawSize = options.showRaw ? (file.contents.length / 1024).toFixed(2).toString() + ' KB' : ''
    const gzipSize = options.showGzip ? (gzipSync(file.contents, { level: 6 }).length / 1024).toFixed(2).toString() + ' KB' : ''
    const color = file.relative.endsWith('map') ? '\x1b[0m' : '\x1b[1m'
    const rawSizeString = options.showRaw ? `\x1b[0m${color}${rawSize.padStart(15)}\x1b[2m (raw) ` : ''
    const gzipSizeString = options.showGzip ? `\x1b[0m${color}${gzipSize.padStart(15)}\x1b[2m (gzip)` : ''
    const filenameLength = COLUMNS - 60
    const filenameString = truncateDots(relative(process.cwd(), file.path).padEnd(filenameLength), filenameLength)

    console.log(''.padEnd(4), color, filenameString, rawSizeString, gzipSizeString, '\x1b[0m')

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = filesize
