import decode from './decode'

it('returns null for non-string input', () => {
  expect(decode(undefined)).toEqual(null)
  expect(decode(42)).toEqual(null)
  expect(decode({})).toEqual(null)
})

it('returns null for invalid length', () => {
  expect(decode('')).toEqual(null)
  expect(decode('23')).toEqual(null)
  expect(decode('23456789CFGH')).toEqual(null) // 12
})

it('returns null for invalid digits', () => {
  expect(decode('1AB')).toEqual(null)
  expect(decode('9FFW84J9-XG')).toEqual(null)
  expect(decode('  9FFW84J9+XG  ')).toEqual(null)
})

it('decodes the plus code', () => {
  expect(decode('9FFW84J9+XG')).toEqual({
    latitude: '59.332438',
    longitude: '18.118813',
    resolution: 0.000125
  })
})

it('decodes codes ending with +', () => {
  expect(decode('9FFW84J9+')).toEqual({
    latitude: '59.331250',
    longitude: '18.118750',
    resolution: 0.0025
  })
  expect(decode('9FFW8400+')).toEqual({
    latitude: '59.325000',
    longitude: '18.125000',
    resolution: 0.05
  })
  expect(decode('9FFW0000+')).toEqual({
    latitude: '59.500000',
    longitude: '18.500000',
    resolution: 1
  })
  expect(decode('9F000000+')).toEqual({
    latitude: '60.000000',
    longitude: '10.000000',
    resolution: 20
  })
})
