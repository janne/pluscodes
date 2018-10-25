import * as R from 'ramda'
import { digits } from './constants'
import { Coord } from './interfaces'

const isValid = R.allPass([R.is(Object), R.has('longitude'), R.has('latitude')])

const digitReducer = ({ value, result, posValue }) => {
  const q = Math.floor(value / posValue)
  return {
    value: value - q * posValue,
    posValue: posValue / 20,
    result: [...result, digits.charAt(q)]
  }
}

const encodeAxis = (length: number, value: number): number =>
  R.compose(
    R.prop('result'),
    R.reduce(digitReducer, { value, posValue: 20, result: [] })
  )(R.repeat(undefined, length))

const interleave = (length: number) =>
  R.compose(
    R.join(''),
    R.insert(8, '+'),
    R.flatten,
    R.append(length > 8 ? [] : R.repeat('0', 8 - length)),
    R.zip
  )

const normalizeLatitude = R.compose(
  R.clamp(0, 180),
  R.add(90)
)

const normalizeLongitude = R.compose(
  R.flip(R.modulo)(360),
  R.add(180)
)

const encode = (coord: Coord, length: number = 10): string | null => {
  if (length < 2 || length > 10 || length % 2 !== 0) return null
  if (!isValid(coord)) return null
  return interleave(length)(
    encodeAxis(length / 2, normalizeLatitude(coord.latitude)),
    encodeAxis(length / 2, normalizeLongitude(coord.longitude))
  )
}

export default encode
