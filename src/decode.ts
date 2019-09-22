import { digits } from './constants'

const regexp = `^[${digits}0]{8}[+]([${digits}]{2})?$`
const matchesDigits = (str: string) => Boolean(str.match(regexp))
const isValid = (subject: unknown): subject is string =>
  typeof subject === 'string' && matchesDigits(subject)

const axisReducer = ({ result, posValue }, value) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / 20
})

const digitsToValues = (xs: string[]) => xs.map(x => digits.indexOf(x))

const decodeAxis = (axis: string[]): number =>
  digitsToValues(axis).reduce(axisReducer, { result: 0, posValue: 20 }).result

const resolution = (code: string) => {
  const length = code.replace(/[+0]/g, '').length / 2
  return 20 / Math.pow(20, length - 1)
}

const decode = (code: unknown) => {
  if (!isValid(code)) return null
  const res = resolution(code)
  const [lat, lon] = code
    .replace(/[+]/g, '')
    .split('')
    .reduce(
      (arrs, digit, idx) =>
        idx % 2 === 0 ? [arrs[0].concat(digit), arrs[1]] : [arrs[0], arrs[1].concat(digit)],
      [[], []]
    )
    .map(decodeAxis)
    .map(axis => axis + res / 2)

  return {
    latitude: parseFloat((lat - 90).toFixed(6)),
    longitude: parseFloat((lon - 180).toFixed(6)),
    resolution: res
  }
}

export default decode
