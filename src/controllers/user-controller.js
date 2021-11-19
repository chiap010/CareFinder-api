const User = require("../models/user-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");

const apikey = require("apikeygen").apikey;

exports.read = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              if (Object.keys(req.query).length === 0) {
                     const users = await User.find().exec();

                     if (users && users.length > 0) {
                            res.status(200).json({ data: users });
                     } else if (users && users.length === 0) {
                            res.status(404).json({
                                   error: "Resource Not Found",
                            });
                     } else {
                            res.status(400).json({ error: "Bad Request" });
                     }
              } else if (req.query.key) {
                     console.log("key:" + req.query.key);
                     const users = await User.find({
                            api_key: req.query.key,
                     }).exec();

                     if (users && users.length > 0) {
                            res.status(200).json({ data: users });
                     } else if (users && users.length === 0) {
                            res.status(404).json({
                                   error: "Resource Not Found",
                            });
                     } else {
                            res.status(400).json({ error: "Bad Request" });
                     }
              } else {
                     res.status(400).json({ error: "Bad Request" });
              }
       } else {
              res.status(401).json({ error: "Not authenticated" });
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
                     res.status(400).json({ error: "Bad Request" });
              }
       } else {
              res.status(401).json({ error: "Not authenticated" });
       }
};

exports.remove = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (isValidKey && permissionLevel === "ADMIN") {
              if (Object.keys(req.query).length === 0) {
                     try {
                            const removePost = await User.remove();
                            res.status(200).json(removePost);
                     } catch (err) {
                            res.status(400).json(err);
                     }
              } else if (req.query.key) {
                     const removePost = await User.deleteMany({
                            api_key: req.query.key,
                     });
                     res.status(200).json(removePost);
              } else {
                     res.status(400).json({ error: "Bad Request" });
              }
       }
};
