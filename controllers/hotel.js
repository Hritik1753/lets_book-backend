import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);

    } catch (err) {
        next(err);
    }

};

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }

};

export const deleteHotel = async (req, res, next) => {
    try {
      await Hotel.findByIdAndDelete(req.params.id);
      res.status(200).json("Hotel has been deleted.");
    } catch (err) {
      next(err);
    }
};
  
export const getHotel = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      res.status(200).json(hotel);
    } catch (err) {
      next(err);
    }
  };
  

//   export const getHotels = async (req, res, next) => {
//     const { min, max, ...others } = req.query;
//     try {
//       const filter = {
        
//         ...others,
//         cheapestPrice: { $gt: min | 1, $lt: max || 999 },
      
//       }
//       // const limit = parseInt(req.query.limit);
//       const hotels = await Hotel.find(filter).limit(parseInt(req.query.limit));
//       res.status(200).json(hotels);
//     } catch (err) {
//       next(err);
//     }
// };


export const getHotels = async (req, res, next) => {
  // const { featured, limit } = req.query;
  const { min, max,featured, limit, ...others } = req.query;

  try {

    const minPrice = parseInt(min);
const maxPrice = parseInt(max);

    // Construct the filter object based on query parameters
    const filter = {
      ...others,
      cheapestPrice: { $gt: minPrice | 1, $lt: maxPrice || 999 },
    };

    // Add featured filter if 'featured=true' is provided
    if (featured === 'true') {
      filter.featured = true;
    }

    // Parse and validate the limit parameter
    const parsedLimit = parseInt(limit);

    // parsedLimit > 0
    // !isNaN(parsedLimit)|| parsedLimit>=0
    // if (!isNaN(parsedLimit)|| parsedLimit>=0) {
      // If limit is a valid number, apply it to the query
      const hotels = await Hotel.find(filter).limit(parsedLimit);
      res.status(200).json(hotels);
    // } else {
      // If limit parameter is invalid or missing, return a bad request response
      // res.status(400).json({ message: 'Invalid or missing limit parameter' });
    // }
  } catch (err) {
    // Handle any errors that occur during the query
    next(err);
  }
};
  

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};


export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};


