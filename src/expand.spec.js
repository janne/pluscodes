const expand = require('./expand')

const coords = { latitude: '59.331250', longitude: '18.118750' }

it('returns null for full codes', () => {
  expect(expand('9FFW84J9+XG', coords)).toEqual(null)
})

it('expands the codes', () => {
  expect(expand('J9+XG', coords)).toEqual('9FFW84J9+XG')
  expect(expand('84J9+XG', coords)).toEqual('9FFW84J9+XG')
  expect(expand('FW84J9+XG', coords)).toEqual('9FFW84J9+XG')
})
