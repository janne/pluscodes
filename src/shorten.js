const expand = require('./expand')
const decode = require('./decode')

const shortenReducer = (fullCode, ref) => (code, length) => {
  const shortCode = fullCode.slice(10 - length)
  return expand(shortCode, ref) === fullCode ? shortCode : code
}

const shorten = (code, ref) => [10, 8, 6, 4].reduce(shortenReducer(code, ref), null)

module.exports = shorten
