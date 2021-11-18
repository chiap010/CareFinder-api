const Hospital = require("../models/hospital-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");
const getPermissionLevel = require("../middleware/getPermissionLevel");

exports.read = async (req, res) => {
       let isValidKey = await isValidAPIKey(req);
       let permissionLevel = await getPermissionLevel(req);

       if (
              isValidKey &&
              (permissionLevel === "USER" || permissionLevel === "ADMIN")
       ) {
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

              const hospitals = await Hospital.find(searchObject).exec();

              if (hospitals && hospitals.length > 0) {
                     res.status(200).json({ data: hospitals });
              } else if (hospitals && hospitals.length === 0) {
                     res.status(404).json({ error: "Resource Not Found" });
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
              res.status(200).json({ data: hospitals });
       } else {
              res.status(401).json({ error: "Not authenticated" });
       }
};

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
                            res.status(400).json({ error: "Bad Request" });
                     }
              } else {
                     res.status(400).json({ error: "Bad Request" });
              }
       }
};

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

                     res.status(200).json({ data: hospitals });
              } else {
                     res.status(400).json({ error: "Bad Request" });
              }
       } else {
              res.status(401).json({ error: "Not authenticated" });
       }
};
