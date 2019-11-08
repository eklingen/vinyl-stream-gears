// Filter unchanged files from the stream by using a cache mechanism with modified file times
// This is needed for files that are written back to src, to prevent an infinite loop
// Call changedInPlace.filter(<dest>) to start.
// Don't forget to call stream.on('finish', changedInPlace.remember(<dest>)) to save the cache.

// TODO:
// - Instead of explicitly calling remember() near the end of the stream, perhaps it can
//   automatically attach to the finish event?

const { createHash } = require('crypto')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { Transform } = require('stream')

const CACHE = {}
const DEFAULT_OPTIONS = {
  method: 'hash' // can also be 'mtime'
}

function getCachePath (destination = '') {
  return resolve(process.cwd(), destination, '.file-cache')
}

function loadCacheFromDisk (destination = '') {
  const cachePath = getCachePath(destination)

  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath))
  }

  return {}
}

function saveCacheToDisk (destination = '') {
  if (!CACHE[destination]) {
    return
  }

  // Remove stale entries before saving
  for (const filepath of Object.keys(CACHE[destination])) {
    if (!existsSync(resolve(process.cwd(), destination, filepath))) {
      delete CACHE[destination][filepath]
    }
  }

  const cachePath = getCachePath(destination)

  writeFileSync(cachePath, JSON.stringify(CACHE[destination], null, 2), 'utf8')
}

function filter (destination = '', options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  if (!CACHE[destination]) {
    CACHE[destination] = loadCacheFromDisk(destination)
  }

  function transform (file, encoding, callback) {
    if (!file.isBuffer() || !file.contents || !file.contents.length) {
      return callback(null, file)
    }

    const value = (options.method === 'hash') ? createHash('sha1').update(file.contents.toString('utf8')).digest().toString('utf8') : file.stat.mtimeMs

    if (CACHE[destination][file.relative] && CACHE[destination][file.relative] === value) {
      return callback()
    }

    CACHE[destination][file.relative] = value

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

function remember (destination = '') {
  if (CACHE[destination]) {
    saveCacheToDisk(destination)
  }

  function transform (file, encoding, callback) {
    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = { filter, remember }
