import { isValidCode, digitToValue } from './utils'
import {
  ENCODING_BASE,
  PAIR_CODE_LENGTH,
  GRID_ROWS,
  GRID_COLUMNS,
  LATITUDE_MAX,
  LONGITUDE_MAX,
} from './constants'

type DecodedLocation = {
  latitude: number
  longitude: number
  latitudeResolution: number
  longitudeResolution: number
}

type Accumulator = {
  posValue: number
  result: number
}

const axisReducer = ({ result, posValue }: Accumulator, value: number) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / ENCODING_BASE,
})

const decodeAxis = (axis: string[]): number =>
  axis.map(digitToValue).reduce(axisReducer, { result: 0, posValue: ENCODING_BASE }).result

const calculatePairResolution = (pairDigits: number): number => {
  return ENCODING_BASE ** (2 - pairDigits)
}

const decodePairCode = (digits: string[]): { lat: number; lon: number; resolution: number } => {
  // Split into latitude and longitude digits (interleaved)
  const [latDigits, lonDigits] = digits.reduce(
    (arrs: string[][], digit: string, idx: number) =>
      idx % 2 === 0 ? [[...arrs[0], digit], arrs[1]] : [arrs[0], [...arrs[1], digit]],
    [[], []]
  )

  const lat = decodeAxis(latDigits)
  const lon = decodeAxis(lonDigits)
  const resolution = calculatePairResolution(latDigits.length)

  return { lat, lon, resolution }
}

const decodeGridCode = (
  baseLat: number,
  baseLon: number,
  baseResolution: number,
  gridDigits: string[]
): { lat: number; lon: number; latRes: number; lonRes: number } => {
  let lat = baseLat
  let lon = baseLon
  let latRes = baseResolution
  let lonRes = baseResolution

  gridDigits.forEach((digitChar) => {
    const value = digitToValue(digitChar)
    if (value === -1) return // Invalid digit, skip

    // Subdivide the cell
    latRes /= GRID_ROWS
    lonRes /= GRID_COLUMNS

    // Extract row and column from the combined digit value
    const row = Math.floor(value / GRID_COLUMNS)
    const col = value % GRID_COLUMNS

    // Add the offset to move to the correct sub-cell
    lat += row * latRes
    lon += col * lonRes
  })

  return { lat, lon, latRes, lonRes }
}

const formatCoordinate = (value: number): number => {
  // Round to 6 decimal places for reasonable precision (~10cm)
  // Using Math.round instead of toFixed to avoid string conversion overhead
  return Math.round(value * 1e6) / 1e6
}

const formatResolution = (value: number): number => {
  // Round to 8 significant figures for resolution values
  // This maintains precision while avoiding floating-point artifacts
  if (value === 0) return 0
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const scale = 10 ** (8 - magnitude - 1)
  return Math.round(value * scale) / scale
}

const decode = (code: string): DecodedLocation | null => {
  if (!isValidCode(code)) return null

  // Remove separator and split into digits
  // Note: zeros are padding and should be removed when calculating resolution
  const allDigits = code.replace(/\+/g, '').split('')
  const nonZeroDigits = code.replace(/[+0]/g, '').split('')

  // Decode the pair code (first 10 digits, but only count non-zero digits for resolution)
  const pairDigits = allDigits.slice(0, Math.min(allDigits.length, PAIR_CODE_LENGTH))
  const pairNonZeroCount = Math.min(nonZeroDigits.length, PAIR_CODE_LENGTH)

  const { lat: pairLat, lon: pairLon } = decodePairCode(pairDigits)
  // Calculate resolution based on non-zero digits
  const pairResolution = calculatePairResolution(pairNonZeroCount / 2)

  // If no grid digits, return the pair code result
  if (allDigits.length <= PAIR_CODE_LENGTH) {
    // Center the coordinates within the cell
    const latitude = formatCoordinate(pairLat - LATITUDE_MAX + pairResolution / 2)
    const longitude = formatCoordinate(pairLon - LONGITUDE_MAX + pairResolution / 2)

    return {
      latitude,
      longitude,
      latitudeResolution: formatResolution(pairResolution),
      longitudeResolution: formatResolution(pairResolution),
    }
  }

  // Decode grid digits (11-15)
  const gridDigits = allDigits.slice(PAIR_CODE_LENGTH)
  const { lat, lon, latRes, lonRes } = decodeGridCode(pairLat, pairLon, pairResolution, gridDigits)

  // Center the coordinates within the final cell
  const latitude = formatCoordinate(lat - LATITUDE_MAX + latRes / 2)
  const longitude = formatCoordinate(lon - LONGITUDE_MAX + lonRes / 2)

  return {
    latitude,
    longitude,
    latitudeResolution: formatResolution(latRes),
    longitudeResolution: formatResolution(lonRes),
  }
}

export default decode
