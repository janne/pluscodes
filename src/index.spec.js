const { encode, decode } = require('.')

describe('encode', () => {
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
})
