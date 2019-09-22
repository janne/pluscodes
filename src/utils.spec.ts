import { isValidCoordinates, isValidCode, digitToValue, valueToDigit, parseNum } from './utils'

describe('isValidCoordinates', () => {
  it('should return null if the input is undefined', () => {
    expect(isValidCoordinates(undefined)).toBe(false)
  })

  it('should return false if the input is not an object', () => {
    expect(isValidCoordinates('foo' as any)).toBe(false)
  })

  it("should return false if the input doesn't contain longitude and latitude", () => {
    expect(isValidCoordinates({} as any)).toBe(false)
    expect(isValidCoordinates({ longitude: '' } as any)).toBe(false)
    expect(isValidCoordinates({ latitude: '' } as any)).toBe(false)
  })

  it('should return true for valid coordinates', () => {
    const latitude = 59.332438
    const longitude = 18.118813
    expect(isValidCoordinates({ latitude, longitude })).toBe(true)
  })
})

describe('isValidCode', () => {
  it('returns null for non-string input', () => {
    expect(isValidCode(undefined)).toBe(false)
    expect(isValidCode(42 as any)).toBe(false)
    expect(isValidCode({} as any)).toBe(false)
  })

  it('returns null for invalid length', () => {
    expect(isValidCode('')).toBe(false)
    expect(isValidCode('23')).toBe(false)
    expect(isValidCode('23456789CFGH')).toBe(false) // 12
  })

  it('returns null for invalid digits', () => {
    expect(isValidCode('1AB')).toBe(false)
    expect(isValidCode('9FFW84J9-XG')).toBe(false)
    expect(isValidCode('  9FFW84J9+XG  ')).toBe(false)
  })

  it('isValidCodes the plus code', () => {
    expect(isValidCode('9FFW84J9+XG')).toBe(true)
  })
})

describe('digitToValue', () => {
  it('converts digits to values', () => {
    expect(digitToValue('2')).toEqual(0)
    expect(digitToValue('9')).toEqual(7)
    expect(digitToValue('F')).toEqual(9)
    expect(digitToValue('W')).toEqual(18)
  })
})

describe('valueToDigit', () => {
  it('converts values to digits', () => {
    expect(valueToDigit(0)).toEqual('2')
    expect(valueToDigit(7)).toEqual('9')
    expect(valueToDigit(9)).toEqual('F')
    expect(valueToDigit(18)).toEqual('W')
  })
})

describe('parseNum', () => {
  it('passes through floats', () => {
    expect(parseNum(1.5)).toBe(1.5)
  })
  it('parses strings', () => {
    expect(parseNum('3.14')).toBe(3.14)
  })
})
