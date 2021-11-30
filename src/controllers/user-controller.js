const User = require("../models/user-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");

const apikey = require("apikeygen").apikey;

const resources = require("../helpers/resources");
const { httpCodeBadRequest } = require("../helpers/resources");

// Handle User HTTP GET
exports.read = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       // If the API key is valid and the user's permissions are admin, then we can return
       // API user data
       if (isValidKey && permissionLevel === "ADMIN") {
              // When there is nothing in the query string...
              if (Object.keys(req.query).length === 0) {
                     // Grab the User collection using find() with no object passed into it.
                     const users = await User.find().exec();

                     // If Users were returned from Mongo DB, we want to return that in a JSON list
                     if (users && users.length > 0) {
                            res.status(resources.httpCodeOK).json({
                                   data: users,
                            });
                     }
                     // If there are no User documents inside the collection, we should return
                     // that we could find find any resources.
                     else if (users && users.length === 0) {
                            res.status(resources.httpCodeNotFound).json({
                                   error: resources.httpStringNotFound,
                            });
                     }
                     // Otherwise, just return a bad request
                     else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              }

              // If the query string isn't blank, and the user has passed in an API key
              // via the query string, we'll use that to check Users in Mongo where the
              // API key passed in matches a User in the collection.
              else if (req.query.key) {
                     const users = await User.find({
                            api_key: req.query.key,
                     }).exec();

                     // When we have a result, return that JSON back
                     if (users && users.length > 0) {
                            res.status(resources.httpCodeOK).json({
                                   data: users,
                            });
                     }
                     // If nothing was returned back from Mongo, return that we couldn't
                     // find any resources.
                     else if (users && users.length === 0) {
                            res.status(resources.httpCodeNotFound).json({
                                   error: resources.httpStringNotFound,
                            });
                     }
                     // Otherwise, return a bad request
                     else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              }
              // If we got something else in the query string -- if it's not nothing or not an
              // API key being passed in, return a bad request
              else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       }
       // If the user wasn't authenticated or doesn't have the rights to view User API documents,
       // return that they aren't authorized to do this operation.
       else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

// Handle User HTTP POST
exports.post = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       // let permissionLevel = await getPermissionLevel(req);

       // TODO:  read POST form HTTP body.  Hardcoding for now
       if (isValidKey) {
              // If the query string is empty, allow post
              if (Object.keys(req.query).length === 0) {
                     const apiKeyToUse = apikey();
                     const post = new User({
                            username: req.body.username,
                            api_key: apiKeyToUse,
                            permission: req.body.permission,
                            createdTs: Date.now,
                     });

                     // Attempt to save our new User document
                     try {
                            const savedPost = await post.save();
                            res.status(resources.httpCodeCreated).json({
                                   data: savedPost,
                            });
                     } catch (err) {
                            res.json({ error: err });
                            console.log(err);
                     }
              }

              // If the query string isn't empty, I'm not really sure how to handle that, so
              // just return a bad request
              else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       }
       // If the API key wasn't valid, don't let the user do anything return that
       // they aren't authorized.
       else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

// Handle User HTTP DELETE
exports.remove = async (req, res) => {
       // Check to see if the API key is valid and grab the permission level
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              if (Object.keys(req.query).length === 0) {
                     try {
                            const removePost = await User.remove();
                            res.status(resources.httpCodeOK).json(removePost);
                     } catch (err) {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              } else if (req.query.key) {
                     const removePost = await User.deleteMany({
                            api_key: req.query.key,
                     });
                     res.status(resources.httpCodeOK).json(removePost);
              } else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       }
};
