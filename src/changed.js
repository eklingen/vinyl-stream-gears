// Filter unchanged files from the stream

const { existsSync, readFileSync, statSync } = require('fs')
const { resolve } = require('path')
const { Transform } = require('stream')

const DEFAULT_OPTIONS = {
  method: 'contents' // can also be 'mtime'
}

function changed (destination = '', options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length || !destination) {
      return callback(null, file)
    }

    const targetPath = resolve(process.cwd(), destination, file.relative)

    if (existsSync(targetPath)) {
      if (options.method === 'contents' && readFileSync(targetPath, { encoding: 'utf8' }) === file.contents.toString('utf8')) {
        return callback()
      } else if (options.method === 'mtime' && (!file.stat || file.stat.mtimeMs <= statSync(targetPath).mtimeMs)) {
        return callback()
      }
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = changed
