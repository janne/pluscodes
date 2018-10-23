import * as R from 'ramda'
import { digits } from './constants'
import { Area } from './interfaces'

const regexp = `^[${digits}0]{8}[+]([${digits}]{2})?$`

const isValid = (str: string) => Boolean(str.match(regexp))

const mapIndexed = R.addIndex(R.map)

const axisReducer = ({ result, posValue }, value: number) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / 20
})

const digitsToValues: number[] = R.map(R.flip(R.indexOf)(digits))

const decodeAxis: number = R.compose(
  R.prop('result'),
  R.reduce(axisReducer, { result: 0, posValue: 20 }),
  digitsToValues
)

const resolution = (code: string): number => {
  const length =
    R.compose(
      R.reject(R.equals('+')),
      R.reject(R.equals('0'))
    )(code).length / 2
  return 20 / Math.pow(20, length - 1)
}

const decode = (code: string): Area => {
  if (!code) return null
  if (!isValid(code)) return null
  const res = resolution(code)
  const [lat, lon] = R.compose(
    R.map(R.add(res / 2)),
    R.map(decodeAxis),
    R.map(R.map(R.head)),
    R.partition(([digit, idx]) => idx % 2 === 0),
    mapIndexed((digit, idx) => [digit, idx]),
    R.reject(R.equals('+'))
  )(code)
  const coords = R.map(axis => parseFloat(axis.toFixed(6)), {
    latitude: lat - 90,
    longitude: lon - 180
  })
  return R.assoc('resolution', res, coords)
}

export default decode
