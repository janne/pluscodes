import decode from './decode'

it('returns null for non-string input', () => {
  expect(decode(undefined as any)).toEqual(null)
  expect(decode(42 as any)).toEqual(null)
  expect(decode({} as any)).toEqual(null)
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

it('decodes a 10 digit plus code', () => {
  expect(decode('9FFW84J9+XG')).toEqual({
    latitude: 59.332438,
    latitudeResolution: 0.000125,
    longitude: 18.118813,
    longitudeResolution: 0.000125,
  })
})

it('decodes a 11 digit plus code', () => {
  expect(decode('9FFW84J9+XGR')).toEqual({
    latitude: 59.332488,
    latitudeResolution: 1 / 40000,
    longitude: 18.118766,
    longitudeResolution: 1 / 32000,
  })
})

it('decodes a 12 digit plus code', () => {
  expect(decode('9FFW84J9+XGR7')).toEqual({
    latitude: 59.332483,
    latitudeResolution: 0.000005,
    longitude: 18.118762,
    longitudeResolution: 0.0000078125,
  })
})

it('decodes a 13 digit plus code', () => {
  expect(decode('9FFW84J9+XGR7H')).toEqual({
    latitude: 59.332483,
    latitudeResolution: 0.000001,
    longitude: 18.118765,
    longitudeResolution: 0.000001953125,
  })
})

it('decodes a 14 digit plus code', () => {
  expect(decode('9FFW84J9+XGR7HP')).toEqual({
    latitude: 59.332483,
    latitudeResolution: 2e-7,
    longitude: 18.118765,
    longitudeResolution: 4.8828125e-7,
  })
})

it('decodes a 15 digit plus code', () => {
  expect(decode('9FFW84J9+XGR7HPX')).toEqual({
    latitude: 59.332483,
    latitudeResolution: 4e-8,
    longitude: 18.118765,
    longitudeResolution: 1.2207031e-7,
  })
})

it('decodes codes ending with +', () => {
  expect(decode('9FFW84J9+')).toEqual({
    latitude: 59.33125,
    latitudeResolution: 0.0025,
    longitude: 18.11875,
    longitudeResolution: 0.0025,
  })

  expect(decode('9FFW8400+')).toEqual({
    latitude: 59.325,
    latitudeResolution: 0.05,
    longitude: 18.125,
    longitudeResolution: 0.05,
  })
  expect(decode('9FFW0000+')).toEqual({
    latitude: 59.5,
    latitudeResolution: 1,
    longitude: 18.5,
    longitudeResolution: 1,
  })
  expect(decode('9F000000+')).toEqual({
    latitude: 60.0,
    latitudeResolution: 20,
    longitude: 10.0,
    longitudeResolution: 20,
  })
})
