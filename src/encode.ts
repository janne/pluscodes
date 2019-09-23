import {
  isValidCoordinates,
  valueToDigit,
  parseNum,
  Coordinates,
  arrayOf,
  zip,
  flatten
} from './utils'

type Accumulator = {
  value: number
  posValue: number
  result: string[]
}

const digitReducer = ({ value, result, posValue }: Accumulator) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, valueToDigit(q)]
  }
}

const encodeAxis = (length: number, value: number): string[] =>
  arrayOf(length, null).reduce(digitReducer, { value, posValue: 20, result: [] }).result

const interleave = (length: number) => (xs: string[], ys: string[]): string => {
  const zipped = zip(xs, ys)
  const padding = length > 8 ? [] : arrayOf(8 - length, '0')
  const digits = [...flatten(zipped), ...padding]

  return [...digits.slice(0, 8), '+', ...digits.slice(8)].join('')
}

const normalizeLatitude = (lat: number) => Math.min(180, Math.max(0, lat + 90))
const normalizeLongitude = (lon: number) => (lon + 180) % 360

const encode = (coordinates: Coordinates, length = 10) => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValidCoordinates(coordinates)) return null
  const latitude = normalizeLatitude(parseNum(coordinates.latitude))
  const longitude = normalizeLongitude(parseNum(coordinates.longitude))
  return interleave(length)(encodeAxis(length / 2, latitude), encodeAxis(length / 2, longitude))
}

export default encode
