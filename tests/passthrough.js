
import test from 'ava'
import { src } from 'vinyl-fs'

const passthrough = require('../modules/passthrough')
const apply = require('../modules/apply')

test.todo('should pass the stream along and nothing else')
