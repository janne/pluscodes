const { encode } = require('.')

const latitude = '59.327438'
const longitude = '18.054312'

it('should return null if the input is undefined', () => {
  expect(encode()).toEqual(null)
})

it('should return null if the input is not an object', () => {
  expect(encode('foo')).toEqual(null)
})

it("should return null if the input doesn't contain longitude and latitude", () => {
  expect(encode({})).toEqual(null)
  expect(encode({ longitude: '' })).toEqual(null)
  expect(encode({ latitude: '' })).toEqual(null)
})

it('calculates the correct pluscode', () => {
  expect(encode({ latitude, longitude })).toEqual('9FFW83G3+XP')
})

it('wraps on longitude above 180°', () => {
  expect(encode({ latitude, longitude: longitude + 360 })).toEqual('9FFW83G3+XP')
})

it('clamps latitudes below -90', () => {
  expect(encode({ latitude: '-90.0', longitude })).toEqual('2F2W2323+2P')
  expect(encode({ latitude: '-90.1', longitude })).toEqual('2F2W2323+2P')
})
