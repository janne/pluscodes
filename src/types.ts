// Public types for library consumers

export type Coordinates = {
  latitude: number | string
  longitude: number | string
}

export type DecodedLocation = {
  latitude: number
  longitude: number
  latitudeResolution: number
  longitudeResolution: number
}
