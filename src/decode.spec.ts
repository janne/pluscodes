import decode from './decode'

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
    latitude: 59.332438,
    longitude: 18.118813,
    resolution: 0.000125
  })
})

it('decodes codes ending with +', () => {
  expect(decode('9FFW84J9+')).toEqual({
    latitude: 59.33125,
    longitude: 18.11875,
    resolution: 0.0025
  })
  expect(decode('9FFW8400+')).toEqual({
    latitude: 59.325,
    longitude: 18.125,
    resolution: 0.05
  })
  expect(decode('9FFW0000+')).toEqual({
    latitude: 59.5,
    longitude: 18.5,
    resolution: 1
  })
  expect(decode('9F000000+')).toEqual({
    latitude: 60.0,
    longitude: 10.0,
    resolution: 20
  })
})
