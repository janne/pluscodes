export type Coordinates = {
  latitude: number | string
  longitude: number | string
}

const digits = '23456789CFGHJMPQRVWX'
const pair = `[${digits}]{2}`
const pairOrZero = `([${digits}]|0){2}`
const regexp = `^${pair}(${pairOrZero}){0,3}[+](${pair})?$`

export const isValidCoordinates = (coordinates: unknown): coordinates is Coordinates =>
  typeof coordinates === 'object' && 'longitude' in coordinates && 'latitude' in coordinates

export const isValidCode = (subject: unknown): subject is string =>
  typeof subject === 'string' && Boolean(subject.match(regexp))

export const digitsToValues = (xs: string[]) => xs.map(x => digits.indexOf(x))

export const valueToDigit = (x: number) => digits.charAt(x)

export const parseNum = (value: number | string): number =>
  typeof value === 'string' ? parseFloat(value) : value