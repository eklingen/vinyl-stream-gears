
import test from 'ava'
import { src } from 'vinyl-fs'

const run = require('../modules/run')
const apply = require('../modules/apply')

test.todo('should run the given command in a shell')
test.todo('should not fail when the command fails')
test.todo('should use `options.env` if given')
test.todo('should use `options.cwd` if given')
test.todo('should use `options.input` if given')
test.todo('should use `options.quiet` if given')
test.todo('should use `options.stdio` if given')
test.todo('should use `options.windowsHide` if given')
