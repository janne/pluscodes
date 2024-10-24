export type Coordinates = {
  latitude: number | string
  longitude: number | string
}

const digits = '23456789CFGHJMPQRVWX'
const pair = `[${digits}]{2}`
const pairOrZero = `([${digits}]|0){2}`
const regexp = `^${pair}(${pairOrZero}){0,3}[+]([${digits}]{2,7})?$`

export const isValidCoordinates = (subject: object): subject is Coordinates => {
  if (subject == null || typeof subject !== 'object') return false
  return 'longitude' in subject! && 'latitude' in subject!
}

export const isValidCode = (subject: unknown): subject is string =>
  typeof subject === 'string' && Boolean(subject.match(regexp))

export const digitToValue = (x: string) => digits.indexOf(x)

export const valueToDigit = (x: number) => digits.charAt(x)

export const parseNum = (value: number | string): number =>
  typeof value === 'string' ? parseFloat(value) : value

export const arrayOf = <T>(count: number, fill: T): T[] => {
  const result = []
  for (let i = 0; i < count; i++) result.push(fill)
  return result
}

export const flatten = <T>(a: T[]) => a.reduce((acc: T[], val: T) => acc.concat(val), [])

export const zip = <T, U>(a: T[], b: U[]) => a.map((e, i) => [e, b[i]])
