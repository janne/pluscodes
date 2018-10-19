const R = require('ramda')
const encode = require('./encode')
const decode = require('./decode')
const { digits } = require('./constants')

const regexp = `^[${digits}]{2}([${digits}]{2})?([${digits}]{2})?[+][${digits}]{2}$`
const matchesDigits = str => Boolean(String(str).match(regexp))

const isValid = R.allPass([matchesDigits, R.is(String)])

const expand = (code, coordinates) => {
  if (!isValid(code)) return null
  const length = 11 - code.length
  const prefixCode = encode(coordinates, length)
  if (!prefixCode) return null
  return `${prefixCode.slice(0, length)}${code}`
}

module.exports = expand
