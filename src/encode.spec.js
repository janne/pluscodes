const { encode } = require('.')

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
  expect(encode({ latitude: '59.327438', longitude: '18.054312' })).toEqual('9FFW83G3+XP')
})
