const multer = require("multer");
const multerConfig = require('../config/multer.config');
module.exports =  multer({fileFilter : multerConfig.imageFilter, storage : multerConfig.storage})
