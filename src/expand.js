const R = require('ramda')
const encode = require('./encode')
const decode = require('./decode')
const { digits } = require('./constants')

const regexp = `^[${digits}]{4}[+][${digits}]{2}$`
const matchesDigits = str => Boolean(String(str).match(regexp))

const isValid = R.allPass([matchesDigits, R.is(String)])

const expand = (code, coordinates) => {
  const prefixCode = encode(coordinates, 4)
  if (!isValid(code)) return null
  if (!prefixCode) return null
  return `${prefixCode.slice(0, 4)}${code}`
}

module.exports = expand
