import shorten from './shorten'

const ref = { latitude: 59.329394, longitude: 18.068712 }
const code = '9FFW84J9+XG'

it('returns null on invalid code', () => {
  expect(shorten('invalid', ref)).toEqual(null)
})

it('returns shortest code if reference is same as code', () => {
  expect(shorten(code, { latitude: 59.332438, longitude: 18.118813 })).toEqual('J9+XG')
})

it('returns the shortened code on a local reference', () => {
  expect(shorten(code, ref)).toEqual('84J9+XG')
})

it('returns the shortened code on a national reference', () => {
  expect(shorten(code, { latitude: 62.248996, longitude: 15.32562 })).toEqual('FW84J9+XG')
})

it('returns the full code on a global reference', () => {
  expect(shorten(code, { latitude: 59.329394, longitude: -162.068712 })).toEqual(code)
})
