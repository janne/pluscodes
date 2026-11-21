import encode from './encode'
import decode from './decode'
import { isValidCoordinates, isValidCode, parseNum, Coordinates } from './utils'
import { SEPARATOR_POSITION, LATITUDE_MAX, LONGITUDE_MAX } from './constants'

// Move the decoded value by one cell towards the reference when it is more than half a cell
// away, as long as the moved cell stays within [min, max]
const adjust = (axis: number, ref: number, resolution: number, min = -Infinity, max = Infinity) => {
  if (axis <= ref - resolution / 2 && axis + resolution <= max) return axis + resolution
  if (axis > ref + resolution / 2 && axis - resolution >= min) return axis - resolution
  return axis
}

const clipLatitude = (lat: number) => Math.min(Math.max(lat, -LATITUDE_MAX), LATITUDE_MAX)

const normalizeLongitude = (lon: number) =>
  ((((lon + LONGITUDE_MAX) % (2 * LONGITUDE_MAX)) + 2 * LONGITUDE_MAX) % (2 * LONGITUDE_MAX)) -
  LONGITUDE_MAX

const expand = (shortCode: string, ref: Coordinates) => {
  if (!isValidCode(shortCode)) return null
  if (!isValidCoordinates(ref)) return null

  // Short codes omit digits from the start, so the separator tells how many are missing
  const prefixLength = SEPARATOR_POSITION - shortCode.indexOf('+')
  if (prefixLength === 0) return shortCode
  // Padding is only allowed in full codes
  if (shortCode.includes('0')) return null

  const prefixedCode = encode(ref, prefixLength)
  if (!prefixedCode) return null

  const code = `${prefixedCode.slice(0, prefixLength)}${shortCode}`
  const coords = decode(code)
  if (!coords) return null

  const { latitude, longitude } = coords
  const resolution = Math.pow(20, 2 - prefixLength / 2)
  const length = code.length - 1

  const refLatitude = clipLatitude(parseNum(ref.latitude))
  const refLongitude = normalizeLongitude(parseNum(ref.longitude))

  return encode(
    {
      latitude: adjust(latitude, refLatitude, resolution, -LATITUDE_MAX, LATITUDE_MAX),
      longitude: adjust(longitude, refLongitude, resolution),
    },
    length,
  )
}

export default expand
