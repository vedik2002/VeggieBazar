const ven = require('../DB/vendor')

const findVendors = async (location, orderItem, orderquan) => {


  try {
    const itemNames = orderItem;
    const itemQuantities = orderquan;

    console.log(itemNames)
    console.log(itemQuantities)
    console.log(location)

    const vendors = await ven.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location
          },
          distanceField: "distance",
          maxDistance: 1000,
          spherical: true
        }
      },
      {
        $lookup: {
          from: "inventory",
          localField: "_id",
          foreignField: "vendor",
          as: "inventory"
        }
      },
      {
        $unwind: "$inventory"
      },
      {
        $match: {
          "inventory.item": { $in: itemNames },
          "inventory.quantity": { $gte: itemQuantities },
          active: true
        }
      },
      {
        $sort: {
          rating: -1,
          distance: 1,
          "inventory.price": 1
        }
      }
    ]);



    const result = vendors.map((vendor) => {
      const { name, location: { coordinates } } = vendor;
      return { name, lat: coordinates[1], long: coordinates[0] };
    });

    return result;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = findVendors