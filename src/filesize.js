// Reports the filesize (plain and gzipped) of files in the stream

const { gzipSync } = require('zlib')
const { relative } = require('path')
const { Transform } = require('stream')

function filesize (options = { showGzip: true }) {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    const fileSize = (file.contents.length / 1024).toFixed(2).toString() + ' KB'
    const gzippedSize = options.showGzip ? (gzipSync(file.contents, { level: 9 }).length / 1024).toFixed(2).toString() + ' KB' : ''
    const color = file.relative.endsWith('map') ? '\x1b[0m' : '\x1b[1m'

    console.log(''.padEnd(4), color, relative(process.cwd(), file.path).padEnd(64), '\x1b[0m', color, fileSize.padStart(12), '\x1b[2m(raw)\x1b[0m', color, gzippedSize.padStart(12), '\x1b[2m(gzip)\x1b[0m')

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = filesize
