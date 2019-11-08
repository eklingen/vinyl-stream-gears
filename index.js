
// Tiny Vinyl-stream utilities -aka Gulp plugins- for tiny stream operations.
// No dependencies. These are not full-featured wrappers for other libraries.

// Most of these functions only work on Vinyl Buffer objects.
// They have only been tested on Vinyl Buffer objects.

// Optional argument objects are not sanitised.

module.exports = {
  append: require('./src/append'),
  apply: require('./src/apply'),
  changed: require('./src/changed'),
  changedInPlace: require('./src/changed-in-place'),
  filesize: require('./src/filesize'),
  filesizeDiff: require('./src/filesize-diff'),
  filter: require('./src/filter'),
  log: require('./src/log'),
  passthrough: require('./src/passthrough'),
  prepend: require('./src/prepend'),
  rename: require('./src/rename'),
  replace: require('./src/replace'),
  run: require('./src/run'),
  sassGlob: require('./src/sass-glob')
}
