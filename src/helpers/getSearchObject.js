// Created by Tom Chiapete
// Fall Semester 2021

module.exports = async function (req) {
       // Declare a search object that we will build upon depending
       // on what we see in the query string.
       let searchObject = {};

       // $option: "i" means that we're matching strings, but case sensitivity does NOT matter.
       // Wanted to make the server more flexible for when a client makes requests

       // If providerId is in the query string, add it to the search object
       if (req.query.providerId) {
              searchObject.provider_id = {
                     $regex: req.query.providerId,
                     $options: "i",
              };
       }

       // If hospital nameis in the query string, add it to the search object
       if (req.query.name) {
              searchObject.hospital_name = {
                     $regex: req.query.name,
                     $options: "i",
              };
       }

       // If city name is in the query string, add it to the search object
       if (req.query.city) {
              searchObject.city = {
                     $regex: req.query.city,
                     $options: "i",
              };
       }

       // If state is in the query string, add it to the search object
       if (req.query.state) {
              searchObject.state = {
                     $regex: req.query.state,
                     $options: "i",
              };
       }

       // If zip code is in the query string, add it to the search object
       if (req.query.zipCode) {
              searchObject.zip_code = {
                     $regex: req.query.zipCode,
                     $options: "i",
              };
       }

       // If county is in the query string, add it to the search object
       if (req.query.county) {
              searchObject.county_name = {
                     $regex: req.query.county,
                     $options: "i",
              };
       }

       // If emergency services is in the query string, add it to the search object
       if (req.query.emergency) {
              searchObject.emergency_services = {
                     $regex: req.query.emergency,
                     $options: "i",
              };
       }

       // If ownership is in the query string, add it to the search object
       if (req.query.ownership) {
              searchObject.hospital_ownership = {
                     $regex: req.query.ownership,
                     $options: "i",
              };
       }

       // If hospital type is in the query string, add it to the search object
       if (req.query.type) {
              searchObject.hospital_type = {
                     $regex: req.query.type,
                     $options: "i",
              };
       }

       // If latitude, longitude, and distance is in the query string, add it to the search object
       if (req.query.lat && req.query.lon && req.query.dist) {
              // MongoDB wants our distance in meters.  The assignment has us passing in the miles.
              // We have to do a conversion from miles to meters.
              const factor = 1609;
              const distanceInMeters =
                     parseFloat(req.query.dist) * parseFloat(factor);

              // We need our distance value to meters from a miles value inputted through the query string.
              // MongoDB $near queries require the distance in meters.
              // https://docs.mongodb.com/manual/reference/operator/query/near/
              searchObject.geoloc = {
                     $near: {
                            $geometry: {
                                   type: "Point",
                                   coordinates: [req.query.lon, req.query.lat],
                            },
                            $maxDistance: distanceInMeters,
                     },
              };
       }

       return searchObject;
};
