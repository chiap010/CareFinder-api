const mongoose = require("mongoose");
const schema = mongoose.Schema;

const schemaOptions = {
       timestamp: true,
};

const UserSchema = new schema({
       username: { type: String },
       api_key: { type: String },
       permission: { type: String },
       createdAt: { type: Date, default: Date.now },
});

const sch = new mongoose.Schema(UserSchema, schemaOptions);

module.exports = mongoose.model("User", sch);
