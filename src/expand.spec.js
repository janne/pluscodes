const expand = require('./expand')

const coords = { latitude: '59.331250', longitude: '18.118750' }

it('returns null for full codes', () => {
  expect(expand('9FFW84J9+XG', coords)).toEqual(null)
})

it('expands the codes', () => {
  const refCoords = { latitude: '59.329394', longitude: '18.068712' }
  expect(expand('FW84J9+XG', refCoords)).toEqual('9FFW84J9+XG')
  expect(expand('84J9+XG', refCoords)).toEqual('9FFW84J9+XG')
  expect(expand('J9+XG', refCoords)).toEqual('9FFW83J9+XG') // westward
})
