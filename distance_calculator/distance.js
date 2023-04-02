function calculateDistance(lat1, long1, lat2, long2) {
  const R = 6371; // radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLong = (long2 - long1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
module.exports = calculateDistance