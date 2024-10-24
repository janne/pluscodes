import encode from './encode'
import decode from './decode'
import { isValidCoordinates, isValidCode, parseNum, Coordinates } from './utils'

const adjust = (axis: number, refAxis: string | number, resolution: number) => {
  const refFloat = parseNum(refAxis)
  if (axis > refFloat + resolution / 2) return axis - resolution
  if (axis < refFloat - resolution / 2) return axis + resolution
  return axis
}

const expand = (shortCode: string, ref: Coordinates) => {
  if (!isValidCode(shortCode)) return null
  if (!isValidCoordinates(ref)) return null

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
    longitude: adjust(longitude, ref.longitude, resolution),
  })
}

export default expand
