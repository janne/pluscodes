import fs from 'fs'
import path from 'path'
import encode, { encodeIntegers, locationToIntegers } from './encode'

const latitude = 59.332483
const longitude = 18.118765

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

it('calculates pluscodes of length 10 by default', () => {
  expect(encode({ latitude, longitude })).toEqual('9FFW84J9+XG')
})

it('support longer pluscodes', () => {
  expect(encode({ latitude, longitude }, 10)).toEqual('9FFW84J9+XG')
  expect(encode({ latitude, longitude }, 11)).toEqual('9FFW84J9+XGR')
  expect(encode({ latitude, longitude }, 12)).toEqual('9FFW84J9+XGR7')
  expect(encode({ latitude, longitude }, 13)).toEqual('9FFW84J9+XGR7Q')
  expect(encode({ latitude, longitude }, 14)).toEqual('9FFW84J9+XGR7Q4')
  expect(encode({ latitude, longitude }, 15)).toEqual('9FFW84J9+XGR7Q44')
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

it('it only supports lengths between 2 and 15', () => {
  expect(encode({ latitude, longitude }, 0)).toEqual(null)
  expect(encode({ latitude, longitude }, 1)).toEqual(null)
  expect(encode({ latitude, longitude }, 16)).toEqual(null)
})

it('it only support even lengths below 10', () => {
  expect(encode({ latitude, longitude }, 3)).toEqual(null)
  expect(encode({ latitude, longitude }, 5)).toEqual(null)
  expect(encode({ latitude, longitude }, 7)).toEqual(null)
  expect(encode({ latitude, longitude }, 9)).toEqual(null)
})

it('clamps latitudes of 90 and above to the topmost cell', () => {
  expect(encode({ latitude: 90, longitude: 1 }, 10)).toEqual('CFX3X2X2+X2')
  expect(encode({ latitude: 90.1, longitude: 1 }, 10)).toEqual('CFX3X2X2+X2')
})

it('encodes points on cell edges into the upper cell', () => {
  expect(encode({ latitude: 35.6, longitude: 3.033 }, 10)).toEqual('8F75J22M+26')
  expect(encode({ latitude: 35.6, longitude: 3.033 }, 11)).toEqual('8F75J22M+262')
  expect(encode({ latitude: -48.71, longitude: 142.78 }, 8)).toEqual('4R347QRJ+')
})

describe('reference test data', () => {
  // Test cases from the Open Location Code reference implementation
  const rows = fs
    .readFileSync(path.join(__dirname, 'test-data', 'encoding.csv'), 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(','))
    .map(([lat, lng, latInt, lngInt, length, code]) => ({
      lat: Number(lat),
      lng: Number(lng),
      latInt: Number(latInt),
      lngInt: Number(lngInt),
      length: Number(length),
      code,
    }))
    .filter(({ length }) => length >= 2 && length <= 15)

  it('converts locations to integers', () => {
    // As in the reference implementation, floating point precision may give values 1 less
    for (const { lat, lng, latInt, lngInt } of rows) {
      const [latVal, lngVal] = locationToIntegers(lat, lng)
      expect([latInt, latInt - 1]).toContain(latVal)
      expect([lngInt, lngInt - 1]).toContain(lngVal)
    }
  })

  it('encodes integers', () => {
    for (const { latInt, lngInt, length, code } of rows) {
      expect(encodeIntegers(latInt, lngInt, length)).toEqual(code)
    }
  })

  it('encodes locations whose integer conversion is exact', () => {
    for (const { lat, lng, latInt, lngInt, length, code } of rows) {
      const [latVal, lngVal] = locationToIntegers(lat, lng)
      if (latVal === latInt && lngVal === lngInt) {
        expect(encode({ latitude: lat, longitude: lng }, length)).toEqual(code)
      }
    }
  })
})
