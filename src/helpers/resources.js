// Created by Tom Chiapete
// Fall Semester 2021

// Resources
// Using a resources file so I don't have to hardcode a bunch of stuff in the code.

let resources = {};

resources.httpCodeOK = 200;
resources.httpCodeCreated = 201;
resources.httpCodeBadRequest = 400;
resources.httpCodeUnauthorized = 401;
resources.httpCodeForbidden = 403;
resources.httpCodeNotFound = 404;

resources.httpStringOK = "Done";
resources.httpStringCreated = "Resource Created";
resources.httpStringBadRequest = "Bad Request";
resources.httpStringUnauthorized = "Unauthorized Request";
resources.httpStringForbidden = "Forbidden";
resources.httpStringNotFound = "Resource Not Found";

module.exports = resources;
