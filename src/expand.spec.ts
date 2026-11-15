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

it('returns the code for full codes with more than 10 digits', () => {
  expect(expand('9FFW84J9+XGG', coords)).toEqual('9FFW84J9+XGG')
})

it('expands codes with more than 10 digits', () => {
  const refCoords = { latitude: 59.329394, longitude: 18.068712 }
  expect(expand('FW84J9+XGG', refCoords)).toEqual('9FFW84J9+XGG')
  expect(expand('84J9+XGG', refCoords)).toEqual('9FFW84J9+XGG')
  expect(expand('J9+XGG', refCoords)).toEqual('9FFW83J9+XGG') // westward
  expect(expand('84J9+XGGC', refCoords)).toEqual('9FFW84J9+XGGC')
})

it('expands codes with 13 to 15 digits', () => {
  const refCoords = { latitude: 59.329394, longitude: 18.068712 }
  expect(expand('83JC+22XXQ', refCoords)).toEqual('9FFW83JC+22XXQ')
  expect(expand('83JC+22XXQC', refCoords)).toEqual('9FFW83JC+22XXQC')
  expect(expand('83JC+22XXQC4', refCoords)).toEqual('9FFW83JC+22XXQC4')
})

it('returns null for short codes with padding', () => {
  expect(expand('8400+', coords)).toEqual(null)
  expect(expand('W800+', coords)).toEqual(null)
})

it('returns the code for full codes with padding', () => {
  expect(expand('9FFW8400+', coords)).toEqual('9FFW8400+')
})
