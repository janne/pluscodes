// Open Location Code (Plus Codes) constants
// Based on the specification at https://github.com/google/open-location-code

export const ENCODING_BASE = 20
export const PAIR_CODE_LENGTH = 10
export const GRID_ROWS = 5
export const GRID_COLUMNS = 4
export const GRID_CODE_LENGTH = 5
export const LATITUDE_MAX = 90
export const LONGITUDE_MAX = 180

// Precision constants for grid encoding (digits 11-15)
// PAIR_PRECISION = 20^3 = 8000
// FINAL_LAT_PRECISION = 8000 * 5^5 = 25,000,000
// FINAL_LNG_PRECISION = 8000 * 4^5 = 8,192,000
export const PAIR_PRECISION = ENCODING_BASE ** 3
export const FINAL_LAT_PRECISION = PAIR_PRECISION * GRID_ROWS ** GRID_CODE_LENGTH
export const FINAL_LNG_PRECISION = PAIR_PRECISION * GRID_COLUMNS ** GRID_CODE_LENGTH
