const mrzRoute = require('express').Router();
const dataExtraction = require('../midelwares/dataExtraction');
const passportProcess = require('../midelwares/passportProcess');
const idProcess = require('../midelwares/idProcess');

//mrz recoginze route
mrzRoute.post('/mrzRecoginze', require("../midelwares/serve.files").single("passport-image"), dataExtraction , passportProcess, idProcess)

module.exports = mrzRoute