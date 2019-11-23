
import test from 'ava'
import { src } from 'vinyl-fs'

const filesizeDiff = require('../modules/filesize-diff')
const apply = require('../modules/apply')

test.todo('start() should set `originalFilesize` on the file object')

test.todo('filter() should use default options when not given')
test.todo('filter() should do nothing if `originalFilesize` is not found on the file object')
test.todo('filter() should filter files based on size')
test.todo('filter() should filter files differently, taking the `slack` option into account')

test.todo('report() should use default options when not given')
test.todo('report() should report results to console')
test.todo('report() should only report changed files when `options.reportOnlyChanged` is true')
test.todo('report() should report all files when `options.reportOnlyChanged` is false')
