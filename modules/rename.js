// Rename files in the stream
// Use like .pipe(rename(filename => ({ extname: 'css' })))
// Supports sourcemaps

const { Transform } = require('stream')
const { dirname, basename, extname, join } = require('path')

const DEFAULT_RENAME_FUNCTION = filename => {}

function rename(cb = DEFAULT_RENAME_FUNCTION) {
  function transform(file, encoding, callback) {
    if (!file.isBuffer() || cb === DEFAULT_RENAME_FUNCTION) {
      return callback(null, file)
    }

    let filename = {
      dirname: dirname(file.relative),
      basename: basename(file.relative, extname(file.relative)),
      extname: extname(file.relative),
    }

    filename = { ...filename, ...cb.call(this, filename) }
    file.path = join(file.base, filename.dirname, `${filename.basename}.${filename.extname}`)

    if (file.sourceMap) {
      file.sourceMap.file = file.relative
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = rename
