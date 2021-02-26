const licenseDataExtraction = require("../midelwares/licenseDataExtraction");
const licenseRoute = require("express").Router();

licenseRoute.post(
  "/license",
  require("../midelwares/serve.files").single("license-image"),
  licenseDataExtraction
);

module.exports = licenseRoute;
