import { isValidCode, digitToValue } from './utils'

type Accumulator = {
  posValue: number
  result: number
}

const axisReducer = ({ result, posValue }: Accumulator, value: number) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / 20
})

const decodeAxis = (axis: string[]): number =>
  axis.map(digitToValue).reduce(axisReducer, { result: 0, posValue: 20 }).result

const resolution = (code: string) => {
  const length = code.replace(/[+0]/g, '').length / 2
  return 20 / Math.pow(20, length - 1)
}

const decode = (code: string) => {
  if (!isValidCode(code)) return null
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
