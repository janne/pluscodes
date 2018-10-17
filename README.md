## Overview

Implementation of [plus.codes](https://plus.codes) in Javascript.

## Usage

### Encoding

```javascript
const { encode } = require('pluscodes')
encode({ latitude: '59.332438', longitude: '18.118813' }) // '9FFW84J9+XG'
```

### Decoding

```javascript
const { decode } = require('pluscodes')
decode('9FFW84J9+XG') // { latitude: '59.332438', longitude: '18.118813' }
```

## Author

Jan Andersson, jan.andersson@gmail.com
