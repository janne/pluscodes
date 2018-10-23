import R from 'ramda'
import expand from './expand'
import decode from './decode'

const shortenReducer = (fullCode, ref) => (code, length) => {
  const shortCode = fullCode.slice(10 - length)
  return expand(shortCode, ref) === fullCode ? shortCode : code
}

const shorten = (code, ref) => R.reduce(shortenReducer(code, ref), null, [10, 8, 6, 4])

export default shorten
