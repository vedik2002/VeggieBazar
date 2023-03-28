const ven = require('../DB/vendor')

async function getNearbyVendors(userLat, userLon, orderItem) {
    let maxDistance = 1000; 
    let nearbyVendors = [];
  
    while (nearbyVendors.length === 0 && maxDistance <= 5000) {
      nearbyVendors = await ven.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [userLon, userLat],
            },
            distanceField: 'distance',
            maxDistance: maxDistance,
            spherical: true,
          },
        },
        {
          $match: {
            active: true,
            inventory: {
              $elemMatch: {
                store: orderItem.store,
              },
            },
          },
        },
        {
          $addFields: {
            matchingItems: {
              $filter: {
                input: '$inventory',
                as: 'item',
                cond: { $eq: ['$$item.store', orderItem.store] },
              },
            },
          },
        },
        {
          $addFields: {
            matchingPrice: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$matchingItems',
                    as: 'item',
                    cond: { $lte: ['$$item.price', orderItem.price] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $addFields: {
            matchedItemPrice: { $ifNull: ['$matchingPrice.price', null] },
          },
        },
        {
          $sort: {
            rating: -1, 
            matchedItemPrice: 1, 
          },
        },
      ]);
  
      maxDistance += 1000; 
    }
  
    return nearbyVendors;
  }
  
  

module.exports =  getNearbyVendors