const R = require('ramda')

const digits = '23456789CFGHJMPQRVWX'

const isValid = R.allPass([R.is(Object), R.has('longitude'), R.has('latitude')])

const encode = (coordinates) => {
  if (!isValid(coordinates)) return null
  const { longitude, latitude } = coordinates
  return ''
}

const decode = code => undefined

module.exports = { encode, decode }
