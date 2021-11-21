const User = require("../models/user-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");

const apikey = require("apikeygen").apikey;

const resources = require("../helpers/resources");
const { httpCodeBadRequest } = require("../helpers/resources");

exports.read = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              if (Object.keys(req.query).length === 0) {
                     const users = await User.find().exec();

                     if (users && users.length > 0) {
                            res.status(resources.httpCodeOK).json({
                                   data: users,
                            });
                     } else if (users && users.length === 0) {
                            res.status(resources.httpCodeNotFound).json({
                                   error: resources.httpStringNotFound,
                            });
                     } else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              } else if (req.query.key) {
                     const users = await User.find({
                            api_key: req.query.key,
                     }).exec();

                     if (users && users.length > 0) {
                            res.status(resources.httpCodeOK).json({
                                   data: users,
                            });
                     } else if (users && users.length === 0) {
                            res.status(resources.httpCodeNotFound).json({
                                   error: resources.httpStringNotFound,
                            });
                     } else {
                            res.status(resources.httpCodeBadRequest).json({
                                   error: resources.httpStringBadRequest,
                            });
                     }
              } else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       } else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

exports.post = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       // let permissionLevel = await getPermissionLevel(req);

       if (isValidKey) {
              if (Object.keys(req.query).length === 0) {
                     const apiKeyToUse = apikey();
                     const post = new User({
                            username: "chiap010",
                            api_key: apiKeyToUse,
                            permission: "ADMIN",
                            createdTs: Date.now,
                     });
                     try {
                            const savedPost = await post.save();
                            res.json({ data: savedPost });
                     } catch (err) {
                            res.json({ error: err });
                            console.log(err);
                     }
              } else {
                     res.status(resources.httpCodeBadRequest).json({
                            error: resources.httpStringBadRequest,
                     });
              }
       } else {
              res.status(resources.httpCodeUnauthorized).json({
                     error: resources.httpStringUnauthorized,
              });
       }
};

exports.remove = async (req, res) => {
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
