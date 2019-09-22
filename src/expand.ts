import encode, { Coordinates } from './encode'
import decode from './decode'
import { digits } from './constants'

const pair = `[${digits}]{2}`
const regexp = `^${pair}(${pair})?(${pair})?(${pair})?[+]${pair}$`
const matchesDigits = (str: string) => Boolean(str.match(regexp))
const isValidCode = (subject: unknown): subject is string =>
  typeof subject === 'string' && matchesDigits(subject)
const isValidRef = (subject: unknown): subject is Coordinates =>
  typeof subject === 'object' && 'longitude' in subject && 'latitude' in subject

const adjust = (axis: number, refAxis: string | number, resolution: number) => {
  const refFloat = typeof refAxis === 'string' ? parseFloat(refAxis) : refAxis
  if (axis > refFloat + resolution / 2) return axis - resolution
  if (axis < refFloat - resolution / 2) return axis + resolution
  return axis
}

const expand = (shortCode: unknown, ref: unknown) => {
  if (!isValidCode(shortCode)) return null
  if (!isValidRef(ref)) return null

  const prefixLength = 11 - shortCode.length
  if (prefixLength === 0) return shortCode

  const prefixedCode = encode(ref, prefixLength)
  if (!prefixedCode) return null

  const code = `${prefixedCode.slice(0, prefixLength)}${shortCode}`
  const coords = decode(code)
  if (!coords) return null

  const { latitude, longitude } = coords
  const resolution = Math.pow(20, 2 - prefixLength / 2)

  return encode({
    latitude: adjust(latitude, ref.latitude, resolution),
    longitude: adjust(longitude, ref.longitude, resolution)
  })
}

export default expand
