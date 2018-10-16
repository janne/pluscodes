const R = require('ramda')

const digits = '23456789CFGHJMPQRVWX'

const isValid = R.allPass([R.is(Object), R.has('longitude'), R.has('latitude')])

const parse = value => (R.is(String, value) ? parseFloat(value) : value)

const digitReducer = ({ value, result, posValue }) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, digits.charAt(q)],
  }
}

const encodeAxis = (length, value) => R.compose(
  R.prop('result'),
  R.reduce(digitReducer, { value, posValue: 20, result: [] }),
)([...Array(length)])

const interleave = R.compose(
  R.flatten,
  R.zip,
)

const encode = (coordinates, length = 10) => {
  if (!isValid(coordinates)) return null
  const { longitude, latitude } = R.map(parse, coordinates)
  const lat = encodeAxis(length / 2, latitude + 90)
  const lon = encodeAxis(length / 2, longitude + 180)
  return R.compose(
    R.join(''),
    R.insert(length - 2, '+'),
    interleave,
  )(lat, lon)
}

const decode = () => undefined

module.exports = { encode, decode }
