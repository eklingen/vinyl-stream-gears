// Replace text in files - TODO: ADD SOURCEMAP SUPPORT
// Use: replace([ { replace: (string or regex), value: (string) }, ... ])
// Unknown if this messes up sourcemaps

const { Transform } = require('stream')

function replace (replacements = []) {
  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !replacements.length) {
      return callback(null, file)
    }

    let contents = file.contents.toString('utf8')

    for (const replacement of replacements) {
      contents = replacement.replace ? contents.replace(replacement.replace, replacement.value) : contents
    }

    file.contents = Buffer.from(contents)

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = replace
