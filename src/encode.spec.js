import encode from './encode'

it('should return null if the input is undefined', () => {
  expect(encode(undefined)).toEqual(null)
})
