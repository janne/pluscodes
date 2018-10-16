## Overview

Implementation of [plus.codes](https://plus.codes) in JavaScript.

## Usage

### Encoding

```javascript
const { encode } = require("pluscodes")
encode({ longitude: 18.054312, latitude: 59.327438 }) // 9FFW83G3+XP
```

### Decoding

```javascript
const { encode } = require("pluscodes")
decode("9FFW83G3+XP") // {longitude: 18.054312, latitude: 59.327438 }
```

## Author

Jan Andersson, jan.andersson@gmail.com
