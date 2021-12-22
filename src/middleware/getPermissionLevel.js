// Created by Tom Chiapete
// Fall Semester 2021

const User = require("../models/user-model");

// A function that returns the permission level as it appears in the User collection
// This is used to authorize users to different endpoints

module.exports = async function (req) {
       // Set initial permission level to none
       let userPermission = "NONE";

       // Grab the X-API-KEY header from the request, if there is one.
       let apiKeyHeaderValue = "";
       if (req.get("X-API-KEY") !== undefined) {
              apiKeyHeaderValue = req.get("X-API-KEY");
       }

       // Verify the user based on their API key
       const userQuery = await User.find({ api_key: apiKeyHeaderValue }).exec();

       // If we find a user who has that API key value, get and save the user permission level
       if (userQuery && userQuery.length === 1) {
              if (userQuery[0].permission) {
                     userPermission = userQuery[0].permission;
              }
       }

       // In the end, return the user permission level
       return userPermission;
};
