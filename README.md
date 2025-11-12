## Overview

Implementation of [Open Location Codes](https://plus.codes) (Plus Codes) in JavaScript/TypeScript with full support for 2-15 digit precision.

See a description with running code at [Runkit](https://runkit.com/janne/5bcba8213b24aa0012bc615b).

## Features

- Encode coordinates to Plus Codes (2-15 digits)
- Decode Plus Codes to coordinates
- Shorten codes relative to a reference location
- Expand shortened codes
- Full TypeScript support with type definitions
- Zero dependencies
- Matches Google's reference implementation

## Installation

```bash
npm install pluscodes
```

## Usage

![Diagram](diagram.svg?sanitize=true)

### Encoding

```javascript
const { encode } = require('pluscodes')

// Default 10-digit code (~14m × 14m precision)
encode({ latitude: 59.332438, longitude: 18.118813 }) // '9FFW84J9+XG'

// Custom precision (2-15 digits supported)
encode({ latitude: 59.332483, longitude: 18.118765 }, 11) // '9FFW84J9+XGR'  (3m × 3m)
encode({ latitude: 59.332483, longitude: 18.118765 }, 12) // '9FFW84J9+XGR7' (56cm × 87cm)
encode({ latitude: 59.332483, longitude: 18.118765 }, 15) // '9FFW84J9+XGR7Q44' (4mm × 14mm)

// Lower precision codes
encode({ latitude: 59.332438, longitude: 18.118813 }, 8) // '9FFW84J9+'
encode({ latitude: 59.332438, longitude: 18.118813 }, 4) // '9FFW0000+'
```

### Decoding

```javascript
const { decode } = require('pluscodes')

decode('9FFW84J9+XG')
// {
//   latitude: 59.332438,
//   longitude: 18.118813,
//   latitudeResolution: 0.000125,
//   longitudeResolution: 0.000125
// }

decode('9FFW84J9+XGR7Q44')
// {
//   latitude: 59.332483,
//   longitude: 18.118765,
//   latitudeResolution: 4e-8,
//   longitudeResolution: 1.2207031e-7
// }
```

### Shortening codes

```javascript
const { shorten } = require('pluscodes')
shorten('9FFW84J9+XG', { latitude: 59.329394, longitude: -162.068712 }) // '9FFW84J9+XG'
shorten('9FFW84J9+XG', { latitude: 59.329394, longitude: 18.068712 }) // '84J9+XG'
shorten('9FFW84J9+XG', { latitude: 59.332438, longitude: 18.118813 }) // 'J9+XG'
```

### Expanding short codes

```javascript
const { expand } = require('pluscodes')
expand('FW84J9+XG', { latitude: 59.329394, longitude: 18.068712 }) // '9FFW84J9+XG'
expand('84J9+XG', { latitude: 59.329394, longitude: 18.068712 }) // '9FFW84J9+XG'
expand('J9+XG', { latitude: 59.329394, longitude: 18.068712 }) // '9FFW83J9+XG'
```

## Code Precision

| Digits | Precision (lat × lon) | Example Use Case |
|--------|----------------------|------------------|
| 2      | 20° × 20°            | Country |
| 4      | 1° × 1°              | Large city |
| 6      | 0.05° × 0.05°        | District |
| 8      | 0.0025° × 0.0025°    | Neighborhood |
| 10     | 0.000125° × 0.000125° (~14m × 14m) | Building (default) |
| 11     | 25µ° × 31.25µ° (~3m × 3m) | Building entrance |
| 12     | 5µ° × 7.8µ° (~56cm × 87cm) | Room |
| 13     | 1µ° × 2µ° (~11cm × 22cm) | Table |
| 14     | 0.2µ° × 0.5µ° (~2cm × 5cm) | Chair |
| 15     | 0.04µ° × 0.12µ° (~4mm × 14mm) | Precision object |

## TypeScript Support

```typescript
import { encode, decode, type Coordinates, type DecodedLocation } from 'pluscodes'

const coords: Coordinates = {
  latitude: 59.332483,
  longitude: 18.118765
}

const code = encode(coords, 11) // '9FFW84J9+XGR'
const location: DecodedLocation = decode(code)
```

## Author

Jan Andersson, jan.andersson@gmail.com
