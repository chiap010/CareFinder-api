const Hospital = require("../models/hospital-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");
const resources = require("../helpers/resources");

// Handle hospital HTTP GET
exports.read = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       // Hospital GET methods require a user with the permission level of either USER or ADMIN
       if (
              isValidKey &&
              (permissionLevel === "USER" || permissionLevel === "ADMIN")
       ) {
              // Declare a search object that we will build upon depending
              // on what we see in the query string.
              let searchObject = {};

              // $option: "i" means that we're matching strings, but case sensitively does NOT matter.
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
                                          coordinates: [
                                                 req.query.lon,
                                                 req.query.lat,
                                          ],
                                   },
                                   $maxDistance: distanceInMeters,
                            },
                     };
              }

              // Finally, we're ready to run our find against MongoDB, passing in our searchObject
              // we have been constructing.  Execute the command.
              const hospitals = await Hospital.find(searchObject).exec();

              // If MongoDB returns something, then we want to return that JSON back to the client
              // requesting it.
              if (hospitals && hospitals.length > 0) {
                     res.status(resources.httpCodeOK).json({ data: hospitals });
              }
              // If no results came back from Mongo, then return that we couldn't find any resources matching
              // the request.
              else if (hospitals && hospitals.length === 0) {
                     res.status(resources.httpCodeNotFound).json({
                            error: resources.httpStringNotFound,
                     });
              }
              // If it's something else, return a bad request.
              else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       }

       // If the User doesn't exist or doesn't have the right permission level,
       // return that the request is not authorized.
       else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

// Handle hospital HTTP DELETE
exports.remove = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              let searchObject = {};

              if (req.query.providerId) {
                     searchObject.provider_id = {
                            $regex: req.query.providerId,
                            $options: "i",
                     };
              }

              if (req.query.name) {
                     searchObject.hospital_name = req.query.name;
              }

              if (req.query.city) {
                     searchObject.city = {
                            $regex: req.query.city,
                            $options: "i",
                     };
              }

              if (req.query.state) {
                     searchObject.state = {
                            $regex: req.query.state,
                            $options: "i",
                     };
              }

              if (req.query.zipCode) {
                     searchObject.zip_code = {
                            $regex: req.query.zipCode,
                            $options: "i",
                     };
              }

              if (req.query.county) {
                     searchObject.county_name = {
                            $regex: req.query.county,
                            $options: "i",
                     };
              }

              if (req.query.emergency) {
                     searchObject.emergency_services = {
                            $regex: req.query.emergency,
                            $options: "i",
                     };
              }

              if (req.query.type) {
                     searchObject.hospital_type = {
                            $regex: req.query.type,
                            $options: "i",
                     };
              }

              if (req.query.ownership) {
                     searchObject.hospital_ownership = {
                            $regex: req.query.ownership,
                            $options: "i",
                     };
              }

              const hospitals = await Hospital.deleteMany(searchObject).exec();
              res.status(resources.httpCodeOK).json({ data: hospitals });
       } else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

// Handle hospital HTTP POST
exports.post = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              // Only if query string is empty for the POST, then do something.
              if (Object.keys(req.query).length === 0) {
                     const post = new Hospital({
                            provider_id: req.body.provider_id,
                            hospital_name: req.body.hospital_name,
                            address: req.body.address,
                            city: req.body.city,
                            state: req.body.state,
                            zip_code: req.body.zip_code,
                            county_name: req.body.county_name,
                            phone_number: req.body.phone_number,
                            hospital_type: req.body.hospital_type,
                            hospital_ownership: req.body.hospital_ownership,
                            emergency_services: req.body.emergency_services,
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                     });
                     try {
                            const savedPost = await post.save();
                            res.json(savedPost);
                     } catch (err) {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              } else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       }
};

// Handle hospital HTTP PUT
exports.put = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              if (req.query.providerId) {
                     // Looks like upsert = true will do the create or update
                     const hospitals = await Hospital.findOneAndUpdate(
                            {
                                   provider_id: req.query.providerId,
                            },
                            {
                                   $set: req.body,
                            },
                            {
                                   upsert: true,
                                   new: true,
                            }
                     ).exec();

                     res.status(resources.httpCodeOK).json({ data: hospitals });
              } else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       } else {
              res.status(resource.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};
