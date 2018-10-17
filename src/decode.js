const R = require('ramda')
const { digits } = require('./constants')

const regexp = `^[${digits}0]{8}[+]([${digits}0]{2})?$`

const matchesDigits = str => Boolean(String(str).match(regexp))

const isValid = R.allPass([
  matchesDigits,
  R.compose(
    R.anyPass([R.equals(9), R.equals(11)]),
    R.length
  ),
  R.is(String)
])

const mapIndexed = R.addIndex(R.map)

const axisReducer = ({ result, posValue }, value) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / 20
})

const digitsToValues = R.map(R.indexOf(R.__, digits))

const decodeAxis = R.compose(
  R.reduce(axisReducer, { result: 0, posValue: 20 }),
  digitsToValues
)

const decode = code => {
  if (!isValid(code)) return null
  const [lat, lon] = R.compose(
    R.map(R.prop('result')),
    R.map(decodeAxis),
    R.map(R.map(R.head)),
    R.partition(([digit, idx]) => idx % 2 === 0),
    mapIndexed((digit, idx) => [digit, idx]),
    R.reject(R.equals('+'))
  )(code)
  return R.map(axis => axis.toFixed(6), { latitude: lat - 90, longitude: lon - 180 })
}

module.exports = decode
