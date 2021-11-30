const Hospital = require("../models/hospital-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");
const resources = require("../helpers/resources");
const getSearchObject = require("../helpers/getSearchObject");

// Handle hospital HTTP GET
exports.read = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       try {
              // Hospital GET methods require a user with the permission level of either USER or ADMIN
              if (
                     isValidKey &&
                     (permissionLevel === "USER" || permissionLevel === "ADMIN")
              ) {
                     // Construct the search object.  I have a function to parse the request passed into the function
                     let searchObject = {};
                     searchObject = await getSearchObject(req);

                     // Finally, we're ready to run our find against MongoDB, passing in our searchObject
                     // we have been constructing.  Execute the command.
                     const hospitals = await Hospital.find(searchObject).exec();

                     // If MongoDB returns something, then we want to return that JSON back to the client
                     // requesting it.
                     if (hospitals && hospitals.length > 0) {
                            res.status(resources.httpCodeOK).json({
                                   data: hospitals,
                            });
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
       } catch (err) {
              // If there are caught errors, send back a bad request
              res.status(resources.httpCodeBadRequest).json({
                     error: resources.httpStringBadRequest,
              });
       }
};

// Handle hospital HTTP DELETE
exports.remove = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       try {
              // Validate the API key.  Also the user must have administrative permissions
              // to proceed with the request to delete.
              if (isValidKey && permissionLevel === "ADMIN") {
                     // Construct the search object.  I have a function to parse the request passed into the function
                     let searchObject = {};
                     searchObject = await getSearchObject(req);

                     // First, lets see if there is anything delete, based on the search object passed in
                     const hospitals = await Hospital.find(searchObject).exec();
                     if (hospitals && hospitals.length > 0) {
                            // With the search object, delete those hospitals matching the search criteria.
                            const hospitalsDelete = await Hospital.deleteMany(
                                   searchObject
                            ).exec();
                            res.status(resources.httpCodeOK).json({
                                   data: hospitalsDelete,
                            });
                     }
                     // If there is nothing to delete, return that no resource was found
                     else if (hospitals && hospitals.length === 0) {
                            res.status(resources.httpCodeNotFound).json({
                                   error: resources.httpStringNotFound,
                            });
                     } else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              }
              // If the user isn't authenticated or doesn't have the correct admin permission,
              // return to the client that they aren't authorized.
              else {
                     res.status(resources.httpCodeUnauthorized).json({
                            error: resources.httpStringUnauthorized,
                     });
              }
       } catch (err) {
              // If there are caught errors, send back a bad request
              res.status(resources.httpCodeBadRequest).json({
                     error: resources.httpStringBadRequest,
              });
       }
};

// Handle hospital HTTP POST
exports.post = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       try {
              // Validate the API key.  Also the user must have administrative permissions
              // to proceed with the request to save.
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
                                   hospital_ownership:
                                          req.body.hospital_ownership,
                                   emergency_services:
                                          req.body.emergency_services,
                                   latitude: req.body.latitude,
                                   longitude: req.body.longitude,
                            });

                            // Try saving post to MongoDB.  Otherwise, return a bad request.
                            try {
                                   const savedPost = await post.save();
                                   res.status(resources.httpCodeCreated).json(
                                          savedPost
                                   );
                            } catch (err) {
                                   res.status(
                                          resources.httpCodeBadRequest
                                   ).json({
                                          error: resources.httpStringBadRequest,
                                   });
                            }
                     }
                     // If there is a POST to an endpoint with a query string, I'm going to call it a
                     // bad request, because only POST is explicitly defined for /hospitals without the query string.
                     else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              }
              // If the user isn't authenticated or doesn't have the correct admin permission,
              // return to the client that they aren't authorized.
              else {
                     res.status(resources.httpCodeUnauthorized).json({
                            error: resources.httpStringUnauthorized,
                     });
              }
       } catch (err) {
              // If there are caught errors, send back a bad request
              res.status(resources.httpCodeBadRequest).json({
                     error: resources.httpStringBadRequest,
              });
       }
};

// Handle hospital HTTP PUT
exports.put = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       try {
              // Validate the API key.  Also the user must have administrative permissions
              // to proceed with the request to put.
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

                            // If successful, return the data from the PUT.
                            res.status(resources.httpCodeCreated).json({
                                   data: hospitals,
                            });
                     } else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              }
              // If the user isn't authenticated or doesn't have the correct admin permission,
              // return to the client that they aren't authorized.
              else {
                     res.status(resources.httpCodeUnauthorized).json({
                            error: resources.httpStringUnauthorized,
                     });
              }
       } catch (err) {
              // If there are caught errors, send back a bad request
              res.status(resources.httpCodeBadRequest).json({
                     error: resources.httpStringBadRequest,
              });
       }
};
