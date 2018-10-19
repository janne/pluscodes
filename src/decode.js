const R = require('ramda')
const { digits } = require('./constants')

const regexp = `^[${digits}0]{8}[+]([${digits}]{2})?$`

const matchesDigits = str => Boolean(String(str).match(regexp))

const isValid = R.allPass([matchesDigits, R.is(String)])

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

const resolution = code => {
  const length =
    R.compose(
      R.reject(R.equals('+')),
      R.reject(R.equals('0'))
    )(code).length / 2
  const width = R.reduce(a => a / 20, 20, R.repeat(undefined, length - 1))
  return width
}

const decode = code => {
  if (!isValid(code)) return null
  const res = resolution(code)
  const [lat, lon] = R.compose(
    R.map(R.add(res / 2)),
    R.map(R.prop('result')),
    R.map(decodeAxis),
    R.map(R.map(R.head)),
    R.partition(([digit, idx]) => idx % 2 === 0),
    mapIndexed((digit, idx) => [digit, idx]),
    R.reject(R.equals('+'))
  )(code)
  const coords = R.map(axis => axis.toFixed(6), {
    latitude: lat - 90,
    longitude: lon - 180
  })
  return R.assoc('resolution', res, coords)
}

module.exports = decode
