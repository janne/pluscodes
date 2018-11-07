const { digits } = require('./constants')

const isObject = subject => typeof subject === 'object'
const has = key => obj => key in obj
const isValid = subject => [isObject, has('longitude'), has('latitude')].every(f => f(subject))
const parse = value => (typeof value === 'string' ? parseFloat(value) : value)

const digitReducer = ({ value, result, posValue }) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, digits.charAt(q)]
  }
}

const encodeAxis = (length, value) =>
  Array(length)
    .fill()
    .reduce(digitReducer, { value, posValue: 20, result: [] }).result

const interleave = length => (xs, ys) => {
  const digits = [].concat.apply(
    [],
    xs.map((x, i) => [x, ys[i]]).concat(length > 8 ? [] : Array(8 - length).fill('0'))
  )
  return digits
    .slice(0, 8)
    .concat('+')
    .concat(digits.slice(8))
    .join('')
}

const normalizeLatitude = lat => Math.min(180, Math.max(0, lat + 90))
const normalizeLongitude = lon => (lon + 180) % 360

const encode = (coordinates, length = 10) => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValid(coordinates)) return null
  const latitude = normalizeLatitude(parse(coordinates.latitude))
  const longitude = normalizeLongitude(parse(coordinates.longitude))
  return interleave(length)(encodeAxis(length / 2, latitude), encodeAxis(length / 2, longitude))
}

module.exports = encode
