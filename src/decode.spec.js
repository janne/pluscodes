const decode = require('./decode')

const coords = { latitude: '59.332438', longitude: '18.118813' }

it('returns null for non-string input', () => {
  expect(decode()).toEqual(null)
  expect(decode(42)).toEqual(null)
  expect(decode({})).toEqual(null)
})

it('returns null for invalid length', () => {
  expect(decode('')).toEqual(null)
  expect(decode('23')).toEqual(null)
  expect(decode('23456789CFGH')).toEqual(null) // 12
})

it('returns null for invalid digits', () => {
  expect(decode('1AB')).toEqual(null)
  expect(decode('9FFW83G3-XP')).toEqual(null)
  expect(decode('  9FFW84J9+XG  ')).toEqual(null)
})

it('decodes the plus code', () => {
  expect(decode('9FFW84J9+XG')).toEqual(coords)
})

it('decodes codes ending with +', () => {
  expect(decode('9FFW84J9+')).toEqual({ latitude: '59.331250', longitude: '18.118750' })
  expect(decode('9FFW8400+')).toEqual({ latitude: '59.325000', longitude: '18.125000' })
  expect(decode('9FFW0000+')).toEqual({ latitude: '59.500000', longitude: '18.500000' })
  expect(decode('9F000000+')).toEqual({ latitude: '60.000000', longitude: '10.000000' })
})
