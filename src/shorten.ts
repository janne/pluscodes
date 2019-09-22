import expand from './expand'

const isValid = (subject: unknown): subject is string => typeof subject === 'string'

const shortenReducer = (fullCode: string, ref: unknown) => (code: string, length: number) => {
  const shortCode = fullCode.slice(10 - length)
  return expand(shortCode, ref) === fullCode ? shortCode : code
}

const shorten = (code: unknown, ref: unknown) => {
  if (!isValid(code)) return null
  return [10, 8, 6, 4].reduce(shortenReducer(code, ref), null)
}

export default shorten
