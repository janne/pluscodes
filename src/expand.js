const R = require('ramda')
const encode = require('./encode')
const decode = require('./decode')
const { digits } = require('./constants')

const pair = `[${digits}]{2}`
const regexp = `^${pair}(${pair})?(${pair})?[+]${pair}$`
const matchesDigits = str => Boolean(String(str).match(regexp))

const isValid = R.allPass([matchesDigits, R.is(String)])

const adjust = (axis, refAxis, resolution) => {
  if (axis > refAxis + resolution / 2) return axis - resolution
  if (axis < refAxis - resolution / 2) return axis + resolution
  return axis
}

const expand = (shortCode, ref) => {
  if (!isValid(shortCode)) return null

  const prefixLength = 11 - shortCode.length
  const prefixedCode = encode(ref, prefixLength)
  if (!prefixedCode) return null

  const code = `${prefixedCode.slice(0, prefixLength)}${shortCode}`
  const { latitude, longitude } = decode(code)
  const resolution = Math.pow(20, 2 - prefixLength / 2)

  return encode({
    latitude: adjust(latitude, parseFloat(ref.latitude), resolution),
    longitude: adjust(longitude, parseFloat(ref.longitude), resolution)
  })
}

module.exports = expand
