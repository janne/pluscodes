export type Coordinates = {
  latitude: number | string
  longitude: number | string
}

const digits = '23456789CFGHJMPQRVWX'
const pair = `[${digits}]{2}`
const pairOrZero = `([${digits}]|0){2}`
const regexp = `^${pair}(${pairOrZero}){0,3}[+]([${digits}]{2,7})?$`
const numberRegexp = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/

export const isValidCoordinates = (subject: object): subject is Coordinates => {
  if (subject == null || typeof subject !== 'object') return false
  if (!('longitude' in subject!) || !('latitude' in subject!)) return false
  const { latitude, longitude } = subject as Coordinates
  return Number.isFinite(parseNum(latitude)) && Number.isFinite(parseNum(longitude))
}

export const isValidCode = (subject: unknown): subject is string =>
  typeof subject === 'string' && Boolean(subject.match(regexp))

export const digitToValue = (x: string) => digits.indexOf(x)

export const valueToDigit = (x: number) => digits.charAt(x)

// Strings must be a plain decimal number, so e.g. '59.33abc' or '0x1F' give NaN
export const parseNum = (value: number | string): number =>
  typeof value === 'string' ? (numberRegexp.test(value) ? Number(value) : NaN) : value
