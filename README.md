## Overview
Implementation of [plus.codes](https://plus.codes) in JavaScript.

## Usage

### Encoding

```javascript
const { encode } = require('pluscodes')
encode({longitude: '59.327593', latitude: '18.054399' }) // 9FFW83G3+XP
```

### Decoding

```javascript
const { encode } = require('pluscodes')
decode('9FFW83G3+XP') // {longitude: '59.327593', latitude: '18.054399' }
```

## Author

Jan Andersson, jan.andersson@gmail.com