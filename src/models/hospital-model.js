const mongoose = require("mongoose");
const schema = mongoose.Schema;

const schemaOptions = {
       timestamp: true,
};

const hospitalSchema = new schema({
       provider_id: { type: String },
       hospital_name: { type: String, trim: true },
       address: { type: String, trim: true },
       city: { type: String, trim: true },
       state: { type: String, trim: true },
       zip_code: { type: String, trim: true },
       county_name: { type: String, trim: true },
       phone_number: { type: String, trim: true },
       hospital_type: { type: String, trim: true },
       hospital_ownership: { type: String, trim: true },
       emergency_services: { type: String, trim: true },
       human_address: { type: String, trim: true },
       latitude: { type: Number },
       longitude: { type: Number },
       needs_recoding: { type: String, trim: true },
});

const sch = new mongoose.Schema(hospitalSchema, schemaOptions);

module.exports = mongoose.model("Hospitals", sch);
