import {
  isValidCoordinates,
  valueToDigit,
  parseNum,
  Coordinates,
  arrayOf,
  zip,
  flatten,
} from './utils'

// Open Location Code constants
const ENCODING_BASE = 20
const PAIR_CODE_LENGTH = 10
const GRID_ROWS = 5
const GRID_COLUMNS = 4
const GRID_CODE_LENGTH = 5
const LATITUDE_MAX = 90
const LONGITUDE_MAX = 180

// Precision constants for grid encoding (digits 11-15)
// PAIR_PRECISION = 20^3 = 8000
// FINAL_LAT_PRECISION = 8000 * 5^5 = 25,000,000
// FINAL_LNG_PRECISION = 8000 * 4^5 = 8,192,000
const PAIR_PRECISION = ENCODING_BASE ** 3
const FINAL_LAT_PRECISION = PAIR_PRECISION * GRID_ROWS ** GRID_CODE_LENGTH
const FINAL_LNG_PRECISION = PAIR_PRECISION * GRID_COLUMNS ** GRID_CODE_LENGTH

type Accumulator = {
  value: number
  posValue: number
  result: string[]
}

const digitReducer = ({ value, result, posValue }: Accumulator) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / ENCODING_BASE,
    result: [...result, valueToDigit(q)],
  }
}

const encodeAxis = (length: number, value: number): Accumulator =>
  arrayOf(length, null).reduce(digitReducer, { value, posValue: ENCODING_BASE, result: [] })

const interleave =
  (length: number) =>
    (xs: string[], ys: string[]): string => {
      const zipped = zip(xs, ys)
      const padding = length > 8 ? [] : arrayOf(8 - length, '0')
      const digits = [...flatten(zipped), ...padding]

      return [...digits.slice(0, 8), '+', ...digits.slice(8)].join('')
    }

const clampLatitude = (lat: number) => Math.max(-LATITUDE_MAX, Math.min(LATITUDE_MAX, lat))
const normalizeLatitude = (lat: number) => clampLatitude(lat) + LATITUDE_MAX
const normalizeLongitude = (lon: number) => {
  let normalized = lon % (2 * LONGITUDE_MAX)
  if (normalized < -LONGITUDE_MAX) normalized += 2 * LONGITUDE_MAX
  if (normalized >= LONGITUDE_MAX) normalized -= 2 * LONGITUDE_MAX
  return normalized + LONGITUDE_MAX
}

const encodePairCode = (lat: number, lon: number, length: number): string => {
  const normalizedLat = normalizeLatitude(lat)
  const normalizedLon = normalizeLongitude(lon)
  const latAcc = encodeAxis(length / 2, normalizedLat)
  const lonAcc = encodeAxis(length / 2, normalizedLon)
  return interleave(length)(latAcc.result, lonAcc.result)
}

const encodeGridCode = (lat: number, lon: number, gridLength: number): string => {
  // Convert to high-precision integers
  let latVal = Math.floor(lat * FINAL_LAT_PRECISION)
  latVal = Math.max(0, Math.min(latVal + LATITUDE_MAX * FINAL_LAT_PRECISION, 2 * LATITUDE_MAX * FINAL_LAT_PRECISION - 1))

  let lonVal = Math.floor(lon * FINAL_LNG_PRECISION)
  lonVal += LONGITUDE_MAX * FINAL_LNG_PRECISION

  // Normalize longitude to valid range
  const maxLonVal = 2 * LONGITUDE_MAX * FINAL_LNG_PRECISION
  if (lonVal < 0 || lonVal >= maxLonVal) {
    lonVal = ((lonVal % maxLonVal) + maxLonVal) % maxLonVal
  }

  // Divide out unused grid precision
  const unusedDigits = GRID_CODE_LENGTH - gridLength
  if (unusedDigits > 0) {
    latVal = Math.floor(latVal / (GRID_ROWS ** unusedDigits))
    lonVal = Math.floor(lonVal / (GRID_COLUMNS ** unusedDigits))
  }

  // Extract grid digits (from least to most significant)
  const digits: string[] = []
  for (let i = 0; i < gridLength; i++) {
    const latDigit = latVal % GRID_ROWS
    const lngDigit = lonVal % GRID_COLUMNS
    digits.unshift(valueToDigit(latDigit * GRID_COLUMNS + lngDigit))
    latVal = Math.floor(latVal / GRID_ROWS)
    lonVal = Math.floor(lonVal / GRID_COLUMNS)
  }

  return digits.join('')
}

const encode = (coordinates: Coordinates, length = 10) => {
  if (length < 2 || length > 15 || (length < PAIR_CODE_LENGTH && length % 2 !== 0)) {
    return null
  }
  if (!isValidCoordinates(coordinates)) return null

  const lat = parseNum(coordinates.latitude)
  const lon = parseNum(coordinates.longitude)

  // Encode the first 10 digits (pair code)
  const pairLength = Math.min(length, PAIR_CODE_LENGTH)
  const pairCode = encodePairCode(lat, lon, pairLength)

  // If we need more precision, add grid digits (11-15)
  if (length > PAIR_CODE_LENGTH) {
    const gridLength = length - PAIR_CODE_LENGTH
    const gridCode = encodeGridCode(lat, lon, gridLength)
    return pairCode + gridCode
  }

  return pairCode
}

export default encode
