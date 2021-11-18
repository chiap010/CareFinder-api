const User = require("../models/user-model");

module.exports = async function (req) {
       let userPermission = "NONE";
       let apiKeyHeaderValue = "";

       if (req.get("X-API-KEY") !== undefined) {
              apiKeyHeaderValue = req.get("X-API-KEY");
       }

       const userQuery = await User.find({ api_key: apiKeyHeaderValue }).exec();

       if (userQuery && userQuery.length === 1) {
              if (userQuery[0].permission) {
                     userPermission = userQuery[0].permission;
              }
       }

       return userPermission;
};
