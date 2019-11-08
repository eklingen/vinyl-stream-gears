// Allows globbing in Sass files
// Don't depend on items in the same directory being in a specific order!

const { dirname } = require('path')
const { Transform } = require('stream')

const IMPORT_REGEX = new RegExp('^.*@import (.*);$', 'gm')
const QUOTED_STRING_REGEX = /(['"])(.*?)\1/

function sassGlob () {
  function expandGlob (result, filePath) {
    const { hasMagic, sync } = require('glob')
    const [match, quote, content] = result

    if (!hasMagic(content)) {
      return result.input
    }

    const prefix = result.input.slice(0, result.index)
    const suffix = result.input.slice(result.index + match.length)

    let results = sync(content.replace(/\*$/, '*.scss'), { nodir: true, cwd: dirname(filePath) })
    results = results.map(filename => `${prefix}${quote}${filename}${quote}${suffix}`)

    return results.join(' ')
  }

  function transform (file, encoding, callback) {
    try {
      require.resolve('glob')
    } catch (e) {
      return callback(new Error('SassGlob depends on the "glob" package.'))
    }

    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    file.contents = Buffer.from(file.contents.toString('utf8').replace(IMPORT_REGEX, (line, payload) => expandGlob(QUOTED_STRING_REGEX.exec(line), file.path) || ''))

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = sassGlob
