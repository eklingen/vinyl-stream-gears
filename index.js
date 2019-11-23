// Tiny Vinyl-stream utilities -aka Gulp plugins- for tiny stream operations.
// No dependencies. These are not full-featured wrappers for other libraries.

// Most of these functions only work on Vinyl Buffer objects.
// They have only been tested on Vinyl Buffer objects.

// Optional argument objects are not sanitised.

module.exports = {
  append: require('./modules/append'),
  apply: require('./modules/apply'),
  changed: require('./modules/changed'),
  changedInPlace: require('./modules/changed-in-place'),
  filesize: require('./modules/filesize'),
  filesizeDiff: require('./modules/filesize-diff'),
  filter: require('./modules/filter'),
  log: require('./modules/log'),
  passthrough: require('./modules/passthrough'),
  prepend: require('./modules/prepend'),
  rename: require('./modules/rename'),
  replace: require('./modules/replace'),
  run: require('./modules/run')
}
