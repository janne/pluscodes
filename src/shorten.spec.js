const shorten = require('./shorten')

const ref = { latitude: 59.329394, longitude: 18.068712 }
const code = '9FFW84J9+XG'

it('returns null on invalid code', () => {
  expect(shorten('invalid', ref)).toEqual(null)
})

it('returns full code on invalid reference', () => {
  expect(shorten(code, {})).toEqual(code)
})

it('returns the full code on a distance reference', () => {
  expect(shorten(code, { latitude: ref.latitude, longitude: ref.longitude + 180 })).toEqual(code)
})

it('returns the shortened code on a local reference', () => {
  expect(shorten(code, ref)).toEqual('84J9+XG')
})
