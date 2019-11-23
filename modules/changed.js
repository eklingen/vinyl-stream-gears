// Filter unchanged files from the stream

const { existsSync, readFileSync, statSync } = require('fs')
const { resolve } = require('path')
const { Transform } = require('stream')

const DEFAULT_OPTIONS = {
  method: 'contents', // can also be 'mtime' or 'exists'
  injectSourceMapComment: false
}

function changed (destination = '', options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length || !destination) {
      return callback(null, file)
    }

    const targetPath = resolve(process.cwd(), destination, file.relative)

    if (!existsSync(targetPath)) {
      return callback(null, file)
    }

    if (options.method === 'exists') {
      return callback()
    }

    if (options.method === 'mtime' && (!file.stat || file.stat.mtimeMs <= statSync(targetPath).mtimeMs)) {
      return callback()
    }

    if (options.method === 'contents') {
      let contents = file.contents.toString('utf8')

      if (options.injectSourceMapComment) {
        const sourceMapComment = `\n/*# sourceMappingURL=${file.basename}.map */`
        contents = (contents.indexOf(sourceMapComment) === -1) ? contents + sourceMapComment : contents
      }

      if (readFileSync(targetPath, { encoding: 'utf8' }) === contents) {
        return callback()
      }
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = changed
