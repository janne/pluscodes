import expand from './expand'

const coords = { latitude: 59.33125, longitude: 18.11875 }

const code = '9FFW84J9+XG'

it('returns null for invalid codes', () => {
  expect(expand(undefined as any, coords)).toEqual(null)
  expect(expand(null as any, coords)).toEqual(null)
  expect(expand('xyz', coords)).toEqual(null)
})

it('returns null for invalid reference', () => {
  expect(expand(code, {} as any)).toEqual(null)
})

it('returns the code for full codes', () => {
  expect(expand(code, coords)).toEqual(code)
})

it('expands the codes', () => {
  const refCoords = { latitude: 59.329394, longitude: 18.068712 }
  expect(expand('FW84J9+XG', refCoords)).toEqual(code)
  expect(expand('84J9+XG', refCoords)).toEqual(code)
  expect(expand('J9+XG', refCoords)).toEqual('9FFW83J9+XG') // westward
})
