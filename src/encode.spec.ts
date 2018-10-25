import encode from './encode'

const latitude = 59.332438
const longitude = 18.118813

it('calculates the correct pluscode', () => {
  expect(encode({ latitude, longitude })).toEqual('9FFW84J9+XG')
})

it('wraps on longitude above 180°', () => {
  expect(encode({ latitude, longitude: longitude + 360 })).toEqual('9FFW84J9+XG')
})

it('clamps latitudes below -90', () => {
  expect(encode({ latitude: -90.0, longitude })).toEqual('2F2W2429+2G')
  expect(encode({ latitude: -90.1, longitude })).toEqual('2F2W2429+2G')
})

it('has full length by default', () => {
  expect(encode({ latitude, longitude })).toEqual('9FFW84J9+XG')
})

it('it supports sending length', () => {
  expect(encode({ latitude, longitude }, 10)).toEqual('9FFW84J9+XG')
  expect(encode({ latitude, longitude }, 8)).toEqual('9FFW84J9+')
})

it('adds zero padding on lengths below 8', () => {
  expect(encode({ latitude, longitude }, 8)).toEqual('9FFW84J9+')
  expect(encode({ latitude, longitude }, 6)).toEqual('9FFW8400+')
  expect(encode({ latitude, longitude }, 4)).toEqual('9FFW0000+')
  expect(encode({ latitude, longitude }, 2)).toEqual('9F000000+')
})

it('it only supports lengths above 2 and below 10', () => {
  expect(encode({ latitude, longitude }, 0)).toEqual(null)
  expect(encode({ latitude, longitude }, 1)).toEqual(null)
  expect(encode({ latitude, longitude }, 11)).toEqual(null)
  expect(encode({ latitude, longitude }, 12)).toEqual(null)
})

it('it only even lengths', () => {
  expect(encode({ latitude, longitude }, 3)).toEqual(null)
  expect(encode({ latitude, longitude }, 5)).toEqual(null)
  expect(encode({ latitude, longitude }, 7)).toEqual(null)
  expect(encode({ latitude, longitude }, 9)).toEqual(null)
})
