const jimp = require("jimp");
const Tesseract = require("node-tesseract-ocr");
const LicenseService = require("../services/License.service");
const MrzService = require("../services/mrz.service");

let licenseDataExtraction = (req, res, next) => {
  jimp
    .read(global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`)
    .then(async (lenna) => {
      lenna
        .quality(100) // set JPEG quality
        .greyscale()
        .normalize()
        .resize(2500, jimp.AUTO, jimp.BLEND_SCREEN)
        .contrast(0.3)
        .write(
          global.rootPath + `/temp/${req.file.originalname + "license0.jpg"}`
        )
        .contrast(0.2)
        .write(
          global.rootPath + `/temp/${req.file.originalname + "license1.jpg"}`
        )
        .contrast(0.25)
        .write(
          global.rootPath + `/temp/${req.file.originalname + "license2.jpg"}`
        )
        .contrast(0.25)
        .write(
          global.rootPath + `/temp/${req.file.originalname + "license3.jpg"}`
        );
      let data1 = await Tesseract.recognize(
        global.rootPath + `/temp/${req.file.originalname + "license0.jpg"}`,
        {
          lang: "eng",
          oem: 1,
          psm: 3,
        }
      );
      let data2 = await Tesseract.recognize(
        global.rootPath + `/temp/${req.file.originalname + "license1.jpg"}`,
        {
          lang: "eng",
          oem: 1,
          psm: 3,
        }
      );
      let date3 = await Tesseract.recognize(
        global.rootPath + `/temp/${req.file.originalname + "license2.jpg"}`,
        {
          lang: "eng",
          oem: 1,
          psm: 3,
        }
      );
      let data4 = await Tesseract.recognize(
        global.rootPath + `/temp/${req.file.originalname + "license3.jpg"}`,
        {
          lang: "eng",
          oem: 1,
          psm: 3,
        }
      );
      MrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "passport.jpg"}`
      );
      MrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "license0.jpg"}`
      );
      MrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "license1.jpg"}`
      );
      MrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "license2.jpg"}`
      );
      MrzService.clearTemp(
        global.rootPath + `/temp/${req.file.originalname + "license3.jpg"}`
      );
      let licenseService = new LicenseService();
      res.json(licenseService.filterData(data1, data2, date3, data4));
    });
};

module.exports = licenseDataExtraction;
