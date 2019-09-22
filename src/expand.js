const encode = require('./encode').default
const decode = require('./decode')
const { digits } = require('./constants')

const pair = `[${digits}]{2}`
const regexp = `^${pair}(${pair})?(${pair})?(${pair})?[+]${pair}$`
const matchesDigits = str => Boolean(String(str).match(regexp))
const isString = subject => typeof subject === 'string'
const isObject = subject => typeof subject === 'object'
const isValidCode = subject => [isString, matchesDigits].every(f => f(subject))
const has = key => obj => key in obj
const isValidRef = subject => [isObject, has('longitude'), has('latitude')].every(f => f(subject))

const adjust = (...args) => {
  const [axis, refAxis, resolution] = args.map(parseFloat)
  if (axis > refAxis + resolution / 2) return axis - resolution
  if (axis < refAxis - resolution / 2) return axis + resolution
  return axis
}

const expand = (shortCode, ref) => {
  if (!isValidCode(shortCode)) return null
  if (!isValidRef(ref)) return null

  const prefixLength = 11 - shortCode.length
  if (prefixLength === 0) return shortCode

  const prefixedCode = encode(ref, prefixLength)
  if (!prefixedCode) return null

  const code = `${prefixedCode.slice(0, prefixLength)}${shortCode}`
  const coords = decode(code)
  if (!coords) return null

  const { latitude, longitude } = coords
  const resolution = Math.pow(20, 2 - prefixLength / 2)

  return encode({
    latitude: adjust(latitude, ref.latitude, resolution),
    longitude: adjust(longitude, ref.longitude, resolution)
  })
}

module.exports = expand
