import { isValidCode, digitToValue } from './utils'

type Accumulator = {
  posValue: number
  result: number
}

const axisReducer = ({ result, posValue }: Accumulator, value: number) => ({
  result: result + posValue * (value === -1 ? 0 : value),
  posValue: posValue / 20,
})

const decodeAxis = (axis: string[]): number =>
  axis.map(digitToValue).reduce(axisReducer, { result: 0, posValue: 20 }).result

const resolution = (code: string) => {
  const length = Math.min(code.replace(/[+0]/g, '').length, 10) / 2
  return 20 / Math.pow(20, length - 1)
}

const decode = (code: string) => {
  if (!isValidCode(code)) return null
  const res = resolution(code)
  const digits = code.replace(/[+]/g, '').split('')

  let [lat, lon] = digits
    .slice(0, 10)
    .reduce(
      (arrs: string[][], digit: string, idx: number) =>
        idx % 2 === 0 ? [[...arrs[0], digit], arrs[1]] : [arrs[0], [...arrs[1], digit]],
      [[], []]
    )
    .map(decodeAxis)

  if (digits.length <= 10) {
    return {
      latitude: parseFloat((lat - 90 + res / 2).toFixed(6)),
      longitude: parseFloat((lon - 180 + res / 2).toFixed(6)),
      latitudeResolution: parseFloat(res.toFixed(8)),
      longitudeResolution: parseFloat(res.toFixed(8)),
    }
  }

  let latRes = res
  let lonRes = res

  digits.slice(10).forEach((digitChar) => {
    const value = digitToValue(digitChar)
    if (value === -1) return null

    latRes /= 5
    lonRes /= 4

    const row = Math.floor(value / 4)
    const col = value % 4

    lat += row * latRes
    lon += col * lonRes
  })

  return {
    latitude: parseFloat((lat - 90 + latRes / 2).toFixed(6)),
    longitude: parseFloat((lon - 180 + lonRes / 2).toFixed(6)),
    latitudeResolution: parseFloat(latRes.toFixed(8)),
    longitudeResolution: parseFloat(lonRes.toFixed(8)),
  }
}

export default decode
