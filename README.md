
# Vinyl-stream gears

Tiny Vinyl-stream utilities -aka Gulp plugins- for tiny stream operations. No dependencies. These are not full-featured wrappers for other libraries. Most of these functions only work on Vinyl Buffer objects. They have only been tested on Vinyl Buffer objects. Optional argument objects are not sanitized.

## Installation

`yarn install`. Or `npm install`. Or just copy the files to your own project.

## Usage

You can import only what you need.

```javascript
const { append, prepend } = require('@eklingen/vinyl-stream-gears')
```

---

### Append

Append text to the end of a file.

```javascript
const { append } = require('@eklingen/vinyl-stream-gears')
stream.pipe(append('Merry Christmas'))
```

---

### Apply

Apply a callback function to the file in the stream. Useful for inspecting properties, for example. This is internally also used by the tests. Don't forget to check for `.isBuffer()` or `.contents` etc!

```javascript
const { apply } = require('@eklingen/vinyl-stream-gears')
stream.pipe(apply(file => {
  // do something with file
}))
```

(since v2.0.0) This used to have a flush callback as well, but as it turns out, the flush event is inconsistently handled in Node.
It's best to use stream.Finished or an end handler.

---

### Changed

Leaves only changed files in the stream, as compared to a destination directory. Useful to prevent unnecessary writes.

```javascript
const { changed } = require('@eklingen/vinyl-stream-gears')
stream.pipe(changed('path/to/destination'))
```

You can choose between comparing either the file contents (default) via the option `method: 'contents'` or the file's modified timestamp via the option `method: 'mtime'`. The last one is less reliable in combination with source control.

```javascript
stream.pipe(changed('path/to/destination', { method: 'mtime' })) // Compare via modified timestamp
```

If you don't care about the file contents, just that it is physically present, you could set the option `method: 'exists'`.

```javascript
stream.pipe(changed('path/to/destination', { method: 'exists '})) // Skips if a file with the same name already exists
```

When comparing file contents, keep in mind that anything that is added later in the stream will show up as a difference. If a sourcemap comment is added later in the stream, this shows up as a difference. Use the option `injectSourceMapComment: true` to append a sourcemap comment to the file contents when comparing. Appending it to a the file itself could cause some tools to output it twice.

```javascript
stream.pipe(changed('path/to/destination', { injectSourceMapComment: true })) // Pretends the source file has a sourcemap comment added for comparison
```

---

### Changed in place

Leaves only changed files in the stream, as compared to a destination directory. It also saves a cache file `.cache-file` to disk in the destination folder, with the filenames and their resulting value. It will add new files to the cache and remove non-existing files the next time around. Useful if you want to write changes back to the source directory, to prevent an infinite loop and unnecessary writes. When compressing images, for example. Don't forget to call `.remember()` in the finish event of the stream.

```javascript
const { changedInPlace } = require('@eklingen/vinyl-stream-gears')
stream.pipe(changedInPlace.filter('path/to/destination'))
...
stream.on('finish', () => changedInPlace.remember('path/to/destination')) // Save cache file
return stream
```

You can choose between comparing either the SHA1 hash of the file contents (default) via the option `method: 'hash'` or the file's modified timestamp via the option `method: 'mtime'`. The last one is less reliable in combination with source control.

```javascript
stream.pipe(changedInPlace.filter('path/to/destination', { method: 'mtime' })) // Compare via modified timestamp
```

---

### Filesize

Report the size of the file passing through the stream.

```javascript
const { filesize } = require('@eklingen/vinyl-stream-gears')
stream.pipe(filesize())
```

By default, both the raw and the gzipped size is shown. Disable the latter via the option `showGzip: false`.

```javascript
stream.pipe(filesize({ showGzip: false }))
```

---

### Filesize diff

Reports the size difference of the file passing through the stream after operations have been performed.

```javascript
const { filesizeDiff } = require('@eklingen/vinyl-stream-gears')
stream.pipe(filesizeDiff.start())
...
stream.pipe(filesizeDiff.report())
```

You can choose to report only the files that have been changed in size (default) via the option `reportOnlyChanged: true` or report all the files via the option `reportOnlyChanged: false`.

```javascript
stream.pipe(filesizeDiff.report({ reportOnlyChanged: false }))
```

You can also use this to filter out files from the stream that have not decreased in size. Useful when compressing images. You can give the change a bit of slack (default is 100) via the option `slack: <Number>`. This number is the amount of bytes it should ignore. This is useful if you don't want to write images to disk that have only decreased a couple of bytes.

```javascript
stream.pipe(filesizeDiff.start())
...
stream.pipe(filesizeDiff.filter({ slack: 100 }))
...
stream.pipe(filesizeDiff.report())
```

---

### Filter

Filter files from the stream by property. Useful if you want to remove certain files from the stream.

```javascript
const { filter } = require('@eklingen/vinyl-stream-gears')
stream.pipe(filter([ file => path.extname(file.relative) === '.map', ... ]))
```

---

### Log

Reports the file in the stream to the console.

```javascript
const { log } = require('@eklingen/vinyl-stream-gears')
stream.pipe(log())
```

You can use the option `showContents: true` to show the contents. This can be helpful when verifying if a plugin is behaving itself.

```javascript
stream.pipe(log({ showContents> true }))
```

---

### Passthrough

Does nothing. Wrapper around `PassThrough`. Can be used for tertiary if else statements within streams.

```javascript
const { passthrough } = require('@eklingen/vinyl-stream-gears')
stream.pipe(debug ? doStuff() : passthrough())
```

---

### Prepend

Prepend text to the beginning of a file.

```javascript
const { prepend } = require('@eklingen/vinyl-stream-gears')
stream.pipe(prepend('Greetings!'))
```

---

### Rename

Rename files in the stream. Also renames sourcemaps, if the file has a `.sourceMap` property. Possible properties in the mutation object are: `filename`, `extname` and `dirname`.

```javascript
const { rename } = require('@eklingen/vinyl-stream-gears')
stream.pipe(rename(filename => ({ extname: 'css' })))
```

---

### Replace

Performs a content replacement on the file in the stream. Can take an array of replacements, in the format `[ { replace: (string or regex), value: (string) }, ... ]`. These replacements are run in the order they are given.

```javascript
const { replace } = require('@eklingen/vinyl-stream-gears')
stream.pipe(replace([
  { replace: '80s', value: '90s' },
  { replace: /(complicated|regex)/g, value: '' }
]))
```

---

### Run

Run a shell command. This one is relatively untested.

```javascript
const { run } = require('@eklingen/vinyl-stream-gears')
stream.pipe(run('ls -ll'))
```

In this use, it just executes the command. You can also pass options. These are the defaults:

```javascript
options = {
  env: process.env,
  cwd: process.cwd(),
  input: false, // STDIO input
  quiet: false, // Don't report anything
  stdio: ['pipe', 'pipe', 'pipe'],
  windowsHide: true // hide console on Windows
}
```

Giving a string to `input` should pass that to STDIO. But again, this is relatively untested.

---

Copyright (c) 2019 Elco Klingen. MIT License.
