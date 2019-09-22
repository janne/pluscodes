import { digits } from './constants'

type Coordinates = {
  latitude: number | string
  longitude: number | string
}

type DigitAccumulator = {
  value: number
  posValue: number
  result: string[]
}

const isObject = (subject: unknown): subject is object => typeof subject === 'object'
const has = (key: string, obj: object) => key in obj
const isValid = (subject: unknown): subject is Coordinates =>
  isObject(subject) && has('longitude', subject) && has('latitude', subject)

const parse = (value: number | string) => (typeof value === 'string' ? parseFloat(value) : value)

const digitReducer = ({ value, result, posValue }: DigitAccumulator) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, digits.charAt(q)]
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

const encode = (coordinates: unknown, length = 10): string => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValid(coordinates)) return null
  const latitude = normalizeLatitude(parse(coordinates.latitude))
  const longitude = normalizeLongitude(parse(coordinates.longitude))
  return interleave(length)(encodeAxis(length / 2, latitude), encodeAxis(length / 2, longitude))
}

export default encode
