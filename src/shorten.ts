import expand from './expand'
import { Coordinates } from './utils'

const isValid = (subject: unknown) => typeof subject === 'string'

const shortenReducer =
  (fullCode: string, ref: Coordinates) => (code: string | null, length: number) => {
    const shortCode = fullCode.slice(10 - length)
    return expand(shortCode, ref) === fullCode ? shortCode : code
  }

const shorten = (code: string, ref: Coordinates) => {
  if (!isValid(code)) return null
  return [10, 8, 6, 4].reduce(shortenReducer(code, ref), null)
}

export default shorten
