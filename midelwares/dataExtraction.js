const mrzService = require("../services/mrz.service");
// const { exec } = require("child_process");
const jimp = require("jimp");
const Tesseract = require("node-tesseract-ocr");

let dataExtraction = (req, res, next) => {
  jimp
    .read(global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`)
    .then((lenna) => {
      const height = lenna.getHeight();
      lenna
        .crop(
          0,
          Math.round(height * 0.6),
          lenna.getWidth(),
          Math.round(height - height * 0.6)
        )
        .quality(100) // set JPEG quality
        .greyscale()
        // .contrast(1)
        .write(
          global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`
        ); // set greyscale
      return Tesseract.recognize(
        global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`,
        {
          lang: "ocrb",
          oem: 1,
          psm: 3,
        }
      );
    })
    .then((data) => {
      req.mrzLines = mrzService.filterString(data);
      mrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`
      );
      next();
    })
    .catch((err) => {
      next({ err, code: 400 });
    });
};

module.exports = dataExtraction;
