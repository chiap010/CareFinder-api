const User = require("../models/user-model");

// A function that checks to see if the user has a valid API key

module.exports = async function (req) {
       // Grab the X-API-KEY header from the request, if there is one.
       let apiKeyHeaderValue = "";
       if (req.get("X-API-KEY") !== undefined) {
              apiKeyHeaderValue = req.get("X-API-KEY");
       }

       // Verify the user based on their API key
       const userQuery = await User.find({ api_key: apiKeyHeaderValue }).exec();

       // If the API key from the HTTP header matches a User, then we can authenticate that user.
       let isAuthenticated = false; // Initially, set the authenticated flag to false.
       if (userQuery && userQuery.length === 1) {
              isAuthenticated = true;
       }

       // Return true or false if the user is authenticated based on API key
       return isAuthenticated;
};
