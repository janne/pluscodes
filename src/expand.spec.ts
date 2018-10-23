import expand from './expand'

const coord = { latitude: 59.33125, longitude: 18.11875 }

const code = '9FFW84J9+XG'

it('returns the code for full codes', () => {
  expect(expand(code, coord)).toEqual(code)
})

it('expands the codes', () => {
  const refCoord = { latitude: 59.329394, longitude: 18.068712 }
  expect(expand('FW84J9+XG', refCoord)).toEqual(code)
  expect(expand('84J9+XG', refCoord)).toEqual(code)
  expect(expand('J9+XG', refCoord)).toEqual('9FFW83J9+XG') // westward
})
