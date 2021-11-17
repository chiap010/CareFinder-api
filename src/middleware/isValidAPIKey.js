const User = require("../models/user-model");

module.exports = async function (req) {
       let apiKeyHeaderValue = "";

       if (req.get("X-API-KEY") !== undefined) {
              apiKeyHeaderValue = req.get("X-API-KEY");
       }

       const userQuery = await User.find({ api_key: apiKeyHeaderValue }).exec();

       let isAuthenticated = false;
       if (userQuery && userQuery.length === 1) {
              isAuthenticated = true;

              /*
              if (userQuery[0].permission) {
                     userPermission = userQuery[0].permission;
              }
              */
       } else {
              console.log("Nope");
       }

       return isAuthenticated;
};
