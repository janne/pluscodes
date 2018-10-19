## Overview

Implementation of [plus.codes](https://plus.codes) in Javascript.

## Usage

### Encoding

```javascript
const { encode } = require('pluscodes')
encode({ latitude: '59.332438', longitude: '18.118813' }) // '9FFW84J9+XG'
encode({ latitude: '59.332438', longitude: '18.118813' }, 8) // '9FFW84J9+'
encode({ latitude: '59.332438', longitude: '18.118813' }, 4) // '9FFW0000+'
```

### Decoding

```javascript
const { decode } = require('pluscodes')
decode('9FFW84J9+XG') // { latitude: '59.332438', longitude: '18.118813', resolution: 0.000125 }
decode('9FFW84J9+') // { latitude: '59.331250', longitude: '18.118750', resolution: 0.0025 }
decode('9FFW0000+') // { latitude: '59.500000', longitude: '18.500000', resolution: 1 }
```

### Expanding short codes

```javascript
const { expand } = require('pluscodes')
expand('FW84J9+XG', { latitude: '59.332438', longitude: '18.118813' }) // '9FFW84J9+XG'
expand('84J9+XG', { latitude: '59.332438', longitude: '18.118813' }) // '9FFW84J9+XG'
expand('J9+XG', { latitude: '59.332438', longitude: '18.118813' }) // '9FFW84J9+XG'
```

## Author

Jan Andersson, jan.andersson@gmail.com
