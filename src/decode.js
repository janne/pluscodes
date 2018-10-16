const R = require('ramda')

const digits = '23456789CFGHJMPQRVWX'

const isValid = R.allPass([
  R.compose(
    R.equals(11),
    R.length,
  ),
  R.is(String),
])

const decode = (code) => {
  if (!isValid(code)) return null
  return {}
}

module.exports = decode
