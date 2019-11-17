// Reports the filesize (plain and gzipped) of files in the stream

const { gzipSync } = require('zlib')
const { relative } = require('path')
const { Transform } = require('stream')

const DEFAULT_OPTIONS = {
  showRaw: true,
  showGzip: true
}

function filesize (options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    const rawSize = options.showRaw ? (file.contents.length / 1024).toFixed(2).toString() + ' KB' : ''
    const gzipSize = options.showGzip ? (gzipSync(file.contents, { level: 6 }).length / 1024).toFixed(2).toString() + ' KB' : ''
    const color = file.relative.endsWith('map') ? '\x1b[0m' : '\x1b[1m'

    const rawSizeString = options.showRaw ? `\x1b[0m${color}${rawSize.padStart(16)}\x1b[2m (raw)` : ''
    const gzipSizeString = options.showGzip ? `\x1b[0m${color}${gzipSize.padStart(16)}\x1b[2m (gzip)` : ''

    console.log(''.padEnd(4), color, relative(process.cwd(), file.path).padEnd(64), rawSizeString, gzipSizeString, '\x1b[0m')

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = filesize
