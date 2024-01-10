// Run a shell command (sync)
// TODO: STDIO should be written to a stream.PassThrough.

const { Transform } = require('stream')
const { execSync } = require('child_process')

const DEFAULT_OPTIONS = {
  env: process.env,
  cwd: process.cwd(),
  input: false,
  quiet: false,
  stdio: ['pipe', 'pipe', 'pipe'],
  windowsHide: true,
}

function run(command, options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  function transform(file, encoding, callback) {
    const data = execSync(command, options).toString()

    if (options.input && file.isBuffer() && file.contents && file.contents.length) {
      file.contents = Buffer.from(data)
    }

    if (!options.input && !options.quiet && data) {
      console.log(data)
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = run
