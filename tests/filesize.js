
import test from 'ava'
import { src } from 'vinyl-fs'

const filesize = require('../modules/filesize')
const apply = require('../modules/apply')

test.todo('should use default options when not given')
test.todo('should report filesizes to the console')
test.todo('should report gzipped filesizes in addition when `options.showGzip` is true')
