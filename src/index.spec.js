const { encode, decode } = require('.')

describe('encode', () => {
    it('should return undefined if the input is undefined', () => {
        expect(encode()).toEqual(undefined)
    })
})
