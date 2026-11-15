import { isValidCoordinates, valueToDigit, parseNum, Coordinates } from './utils'
import {
  ENCODING_BASE,
  PAIR_CODE_LENGTH,
  SEPARATOR_POSITION,
  GRID_ROWS,
  GRID_COLUMNS,
  GRID_CODE_LENGTH,
  LATITUDE_MAX,
  LONGITUDE_MAX,
  FINAL_LAT_PRECISION,
  FINAL_LNG_PRECISION,
} from './constants'

// Convert to integers in units of the smallest grid cell, as the reference implementation does.
// All digits are then extracted from the same integers, so they always describe the same cell.
// Multiplying can land just below a whole number, e.g. 40.6 * 25000000 = 1014999999.9999999,
// which would put a point on a cell edge into the cell below. Rounding to 6 decimals before
// flooring avoids that. The reference floors directly and gets a few of its own test cases wrong.
const toInteger = (value: number, precision: number) =>
  Math.floor(Math.round(value * precision * 1e6) / 1e6)

const latitudeToInteger = (lat: number) => {
  const max = 2 * LATITUDE_MAX * FINAL_LAT_PRECISION
  const value = toInteger(lat, FINAL_LAT_PRECISION) + LATITUDE_MAX * FINAL_LAT_PRECISION
  // Clamp to the range [-90, 90), so latitude 90 is encoded in the topmost cell
  return Math.max(0, Math.min(value, max - 1))
}

const longitudeToInteger = (lon: number) => {
  const max = 2 * LONGITUDE_MAX * FINAL_LNG_PRECISION
  const value = toInteger(lon, FINAL_LNG_PRECISION) + LONGITUDE_MAX * FINAL_LNG_PRECISION
  // Wrap into the range [-180, 180)
  return ((value % max) + max) % max
}

const encodeGridCode = (latVal: number, lonVal: number): string => {
  // Extract grid digits (from least to most significant)
  const digits: string[] = []
  for (let i = 0; i < GRID_CODE_LENGTH; i++) {
    const latDigit = latVal % GRID_ROWS
    const lonDigit = lonVal % GRID_COLUMNS
    digits.unshift(valueToDigit(latDigit * GRID_COLUMNS + lonDigit))
    latVal = Math.floor(latVal / GRID_ROWS)
    lonVal = Math.floor(lonVal / GRID_COLUMNS)
  }
  return digits.join('')
}

const encodePairCode = (latVal: number, lonVal: number): string => {
  // Extract pair digits (from least to most significant), interleaving latitude and longitude
  const digits: string[] = []
  for (let i = 0; i < PAIR_CODE_LENGTH / 2; i++) {
    digits.unshift(valueToDigit(lonVal % ENCODING_BASE))
    digits.unshift(valueToDigit(latVal % ENCODING_BASE))
    latVal = Math.floor(latVal / ENCODING_BASE)
    lonVal = Math.floor(lonVal / ENCODING_BASE)
  }
  return digits.join('')
}

// Convert a location to integers in units of the smallest grid cell
export const locationToIntegers = (lat: number, lon: number): [number, number] => [
  latitudeToInteger(lat),
  longitudeToInteger(lon),
]

// Encode a location given as integers from locationToIntegers
export const encodeIntegers = (latVal: number, lonVal: number, length: number): string => {
  // Encode all 15 digits, then cut the code to the requested length
  const pairCode = encodePairCode(
    Math.floor(latVal / GRID_ROWS ** GRID_CODE_LENGTH),
    Math.floor(lonVal / GRID_COLUMNS ** GRID_CODE_LENGTH)
  )
  const digits = (pairCode + encodeGridCode(latVal, lonVal)).slice(0, length)
  const padding = '0'.repeat(Math.max(0, SEPARATOR_POSITION - digits.length))
  const padded = digits + padding

  return `${padded.slice(0, SEPARATOR_POSITION)}+${padded.slice(SEPARATOR_POSITION)}`
}

const encode = (coordinates: Coordinates, length = 10) => {
  if (length < 2 || (length < PAIR_CODE_LENGTH && length % 2 !== 0)) return null
  if (!isValidCoordinates(coordinates)) return null

  const lat = parseNum(coordinates.latitude)
  const lon = parseNum(coordinates.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

  const [latVal, lonVal] = locationToIntegers(lat, lon)
  // As in the reference implementation, longer codes are capped at the maximum precision
  return encodeIntegers(latVal, lonVal, Math.min(length, PAIR_CODE_LENGTH + GRID_CODE_LENGTH))
}

export default encode
