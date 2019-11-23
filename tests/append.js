
import test from 'ava'
import { src } from 'vinyl-fs'

const append = require('../modules/append')
const apply = require('../modules/apply')

test('should do nothing is if `value` is not given', async t => {
  const source = null
  const value = null
  const expected = 1

  const result = new Promise((resolve, reject) => {
    const stream = src('./tests/assets/empty-file', { read: false })

    stream.pipe(append())
    stream.on('error', () => reject(0))
    stream.on('end', () => resolve(1))
    stream.destroy()
  })

  t.is(await result, expected)
})

test('should not fail if file contents is empty', async t => {
  const source = ''
  const value = 'addition'
  const expected = value

  let contents = ''

  const result = new Promise((resolve, reject) => {
    const stream = src('./tests/assets/empty-file', { read: false })

    stream.pipe(apply(file => file.contents = Buffer.from(source)))
    stream.pipe(append(value))
    stream.on('data', file => contents = file.contents.toString('utf8'))
    stream.on('end', file => resolve(contents))
    stream.destroy()
  })

  t.is(await result, expected)
})

test('should append `value` to the file contents, when it is a string', async t => {
  const source = 'source'
  const value = 'addition'
  const expected = source + value

  let contents = ''

  const result = new Promise((resolve, reject) => {
    const stream = src('./tests/assets/empty-file', { read: false })

    stream.pipe(apply(file => file.contents = Buffer.from(source)))
    stream.pipe(append(value))
    stream.on('data', file => contents = file.contents.toString('utf8'))
    stream.on('end', file => resolve(contents))
    stream.destroy()
  })

  t.is(await result, expected)
})

test('should append the string representation of `value` to the file contents, when it is not a string', async t => {
  const source = 'source'
  const value = 'addition'
  const expected = source + value

  let contents = ''

  const result = new Promise((resolve, reject) => {
    const stream = src('./tests/assets/empty-file', { read: false })

    stream.pipe(apply(file => file.contents = Buffer.from(source)))
    stream.pipe(append(value))
    stream.on('data', file => contents = file.contents.toString('utf8'))
    stream.on('end', file => resolve(contents))
    stream.destroy()
  })

  t.is(await result, expected)
})
