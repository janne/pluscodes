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

it('does not move the code past the poles', () => {
  // Test cases from the Open Location Code reference implementation
  expect(expand('2222+22', { latitude: 89.6, longitude: 0 })).toEqual('CFX22222+22')
  expect(expand('XXXXXX+XX', { latitude: -81, longitude: 0 })).toEqual('2CXXXXXX+XX')
  expect(expand('FRFH3P+3MP', { latitude: 90, longitude: -63.593481 })).toEqual('C7FRFH3P+3MP')
  expect(expand('M7JP+QG', { latitude: -90, longitude: -117.735155 })).toEqual('2524M7JP+QG')
})

it('normalizes the reference longitude', () => {
  expect(expand('W5H36M+9VGM', { latitude: 28.705625, longitude: 180 })).toEqual('72W5H36M+9VGM')
  expect(expand('W5H36M+9VGM', { latitude: 28.705625, longitude: -540 })).toEqual('72W5H36M+9VGM')
  expect(expand('84J9+XG', { latitude: 59.329394, longitude: 378.068712 })).toEqual('9FFW84J9+XG')
})
