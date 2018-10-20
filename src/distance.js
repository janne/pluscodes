const distance = (coordA, coordB, inMiles) => {
  const toRad = x => (x * Math.PI) / 180
  const dLat = Math.sin(toRad(coordB.longitude - coordA.longitude) / 2)
  const dLon = Math.sin(toRad(coordB.latitude - coordA.latitude) / 2)
  const a =
    dLat * dLat +
    Math.cos(toRad(coordA.longitude)) * Math.cos(toRad(coordB.longitude)) * dLon * dLon
  return (inMiles ? 3959 : 6371) * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

module.exports = { distance }
