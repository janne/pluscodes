import * as R from 'ramda'
import encode from './encode'
import decode from './decode'
import { digits } from './constants'
import { Coord } from './interfaces'

const pair = `[${digits}]{2}`
const regexp = `^${pair}(${pair})?(${pair})?(${pair})?[+]${pair}$`
const matchesDigits = (str: string): boolean => Boolean(String(str).match(regexp))

const isValid: boolean = R.allPass([matchesDigits, R.is(String)])

const adjust = (axis: number, refAxis: number, resolution: number): number => {
  if (axis > refAxis + resolution / 2) return axis - resolution
  if (axis < refAxis - resolution / 2) return axis + resolution
  return axis
}

const expand = (shortCode: string, ref: Coord): string => {
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
