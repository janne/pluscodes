const decode = require('./decode')

const coords = { latitude: '59.327438', longitude: '18.054312' }

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
  expect(decode('  9FFW83G3+XP  ')).toEqual(null)
})

it('decodes the plus code', () => {
  expect(decode('9FFW83G3+XP')).toEqual({ latitude: '59.327375', longitude: '18.054250' })
})

it('decodes codes ending with +', () => {
  expect(decode('9FFW83G3+')).toEqual({ latitude: '59.325000', longitude: '18.052500' })
  expect(decode('9FFW8300+')).toEqual({ latitude: '59.300000', longitude: '18.050000' })
  expect(decode('9FFW0000+')).toEqual({ latitude: '59.000000', longitude: '18.000000' })
  expect(decode('9F000000+')).toEqual({ latitude: '50.000000', longitude: '0.000000' })
})
