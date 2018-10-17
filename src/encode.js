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

const encodeAxis = (length, value) =>
  R.compose(
    R.prop('result'),
    R.reduce(digitReducer, { value, posValue: 20, result: [] })
  )([...Array(length)])

const interleave = length =>
  R.compose(
    R.join(''),
    R.insert(length - 2, '+'),
    R.flatten,
    R.zip
  )

const normalizeLatitude = R.compose(
  R.add(90),
  R.clamp(-90, 90)
)

const normalizeLongitude = R.compose(
  R.add(180),
  R.clamp(-180, 180)
)

const encode = (coordinates, length = 10) => {
  if (!isValid(coordinates)) return null
  const { longitude, latitude } = R.map(parse, coordinates)
  return interleave(length)(
    encodeAxis(length / 2, normalizeLatitude(latitude)),
    encodeAxis(length / 2, normalizeLongitude(longitude))
  )
}

module.exports = encode
