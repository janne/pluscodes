const R = require('ramda')

const digits = '23456789CFGHJMPQRVWX'

const isValid = R.allPass([R.is(Object), R.has('longitude'), R.has('latitude')])

const parse = value => (R.is(String, value) ? parseFloat(value) : value)

const digitReducer = ({ value, result, posValue }) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, digits.charAt(q)]
  }
}

const arrayOf = (length, value) => [...Array(length)].map(R.always(value))

const encodeAxis = (length, value) =>
  R.compose(
    R.prop('result'),
    R.reduce(digitReducer, { value, posValue: 20, result: [] })
  )(arrayOf(length))

const interleave = length =>
  R.compose(
    R.join(''),
    R.insert(8, '+'),
    R.flatten,
    R.append(length > 8 ? [] : arrayOf(8 - length, '0')),
    R.zip
  )

const normalizeLatitude = R.compose(
  R.clamp(0, 180),
  R.add(90)
)

const normalizeLongitude = R.compose(
  R.modulo(R.__, 360),
  R.add(180)
)

const encode = (coordinates, length = 10) => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValid(coordinates)) return null
  const { longitude, latitude } = R.map(parse, coordinates)
  return interleave(length)(
    encodeAxis(length / 2, normalizeLatitude(latitude)),
    encodeAxis(length / 2, normalizeLongitude(longitude))
  )
}

module.exports = encode
