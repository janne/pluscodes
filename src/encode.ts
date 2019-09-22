import { isValidCoordinates, valueToDigit, parseNum, Coordinates } from './utils'

type DigitAccumulator = {
  value: number
  posValue: number
  result: string[]
}

const digitReducer = ({ value, result, posValue }: DigitAccumulator) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, valueToDigit(q)]
  }
}

const encodeAxis = (length: number, value: number): string[] =>
  Array(length)
    .fill(undefined)
    .reduce(digitReducer, { value, posValue: 20, result: [] }).result

const interleave = (length: number) => (xs: string[], ys: string[]): string => {
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

const normalizeLatitude = (lat: number) => Math.min(180, Math.max(0, lat + 90))
const normalizeLongitude = (lon: number) => (lon + 180) % 360

const encode = (coordinates: Coordinates, length = 10): string => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValidCoordinates(coordinates)) return null
  const latitude = normalizeLatitude(parseNum(coordinates.latitude))
  const longitude = normalizeLongitude(parseNum(coordinates.longitude))
  return interleave(length)(encodeAxis(length / 2, latitude), encodeAxis(length / 2, longitude))
}

export default encode
