const Hospital = require("../models/hospital-model");
const isValidAPIKey = require("../middleware/isValidAPIKey");

exports.read = async (req, res) => {
       //const hospitals = await Hospital.find().exec();
       //res.json({ data: hospitals });

       let isValidKey = await isValidAPIKey(req);

       if (isValidKey) {
              console.log(isValidKey);
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
              res.status(200).json({ data: hospitals });
       } else {
              res.status(401).json({ data: "Not authenticated" });
       }
};
