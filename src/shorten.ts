import * as R from 'ramda'
import expand from './expand'
import { Coord } from './interfaces'

const shortenReducer = (fullCode: string, ref: Coord) => (code: string, length: number): string => {
  const shortCode = fullCode.slice(10 - length)
  return expand(shortCode, ref) === fullCode ? shortCode : code
}

const shorten = (code: string, ref: Coord): string =>
  R.reduce(shortenReducer(code, ref), null, [10, 8, 6, 4])

export default shorten
