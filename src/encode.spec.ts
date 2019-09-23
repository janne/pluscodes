import encode from './encode'

const latitude = 59.332438
const longitude = 18.118813

it('should return null if the input is undefined', () => {
  expect(encode(undefined as any)).toEqual(null)
})

it('should return null if the input is not an object', () => {
  expect(encode('foo' as any)).toEqual(null)
})

it("should return null if the input doesn't contain longitude and latitude", () => {
  expect(encode({} as any)).toEqual(null)
  expect(encode({ longitude: '' } as any)).toEqual(null)
  expect(encode({ latitude: '' } as any)).toEqual(null)
})

it('calculates the correct pluscode', () => {
  expect(encode({ latitude, longitude })).toEqual('9FFW84J9+XG')
})

it('handles coord as strings', () => {
  expect(encode({ latitude: String(latitude), longitude: String(longitude) })).toEqual(
    '9FFW84J9+XG'
  )
})

it('wraps on longitude above 180°', () => {
  expect(encode({ latitude, longitude: longitude + 360 })).toEqual('9FFW84J9+XG')
})

it('clamps latitudes below -90', () => {
  expect(encode({ latitude: -90.0, longitude })).toEqual('2F2W2429+2G')
  expect(encode({ latitude: -90.1, longitude })).toEqual('2F2W2429+2G')
})

it('has length 11 by default', () => {
  expect(encode({ latitude, longitude })!.length).toEqual(11)
})

it('it supports sending length and adds 1 (the plus)', () => {
  expect(encode({ latitude, longitude }, 10)!.length).toEqual(11)
  expect(encode({ latitude, longitude }, 8)!.length).toEqual(9)
})

it('adds zero padding on lengths below 8', () => {
  expect(encode({ latitude, longitude }, 8)).toEqual('9FFW84J9+')
  expect(encode({ latitude, longitude }, 6)).toEqual('9FFW8400+')
  expect(encode({ latitude, longitude }, 4)).toEqual('9FFW0000+')
  expect(encode({ latitude, longitude }, 2)).toEqual('9F000000+')
})

it('it only supports lengths above 2 and below 10', () => {
  expect(encode({ latitude, longitude }, 0)).toEqual(null)
  expect(encode({ latitude, longitude }, 1)).toEqual(null)
  expect(encode({ latitude, longitude }, 11)).toEqual(null)
  expect(encode({ latitude, longitude }, 12)).toEqual(null)
})

it('it only even lengths', () => {
  expect(encode({ latitude, longitude }, 3)).toEqual(null)
  expect(encode({ latitude, longitude }, 5)).toEqual(null)
  expect(encode({ latitude, longitude }, 7)).toEqual(null)
  expect(encode({ latitude, longitude }, 9)).toEqual(null)
})
