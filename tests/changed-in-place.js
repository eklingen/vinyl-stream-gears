
import test from 'ava'
import { src } from 'vinyl-fs'

const changedInPlace = require('../modules/changed-in-place')
const apply = require('../modules/apply')

test.todo('filter() should do nothing when `destination` is not given')
test.todo('filter() should do nothing when `destination` is not a string with an existing path')
test.todo('filter() should use default options when not given')
test.todo('filter() should compute cache values')
test.todo('filter() should compute cache values as SHA hash when `options.method` is `hash`')
test.todo('filter() should compute cache values as modifiedTime when `options.method` is `mtime`')

test.todo('remember() should do nothing when `destination` is not given')
test.todo('remember() should do nothing when `destination` is not a string with an existing path')
test.todo('remember() should remove stale file references from the cache')
test.todo('remember() should write the cache to disk')
