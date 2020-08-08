const mrzService = require('../services/mrz.service');
const {exec} = require("child_process");

let dataExtraction = (req, res, next)=>{
    exec("python ./services/imageToString.service.py", (error, stdout, stderr)=>{
        if(error){
            return next({code : 400, message : "plase enter a valid documnet"})
        }
        if(stdout){
          stdout = mrzService.filterString(stdout)
          req.mrzLines = stdout
          mrzService.clearTemp()
          return next()
        }
        return next({code : 400, message : "plase enter a valid documnet"})
    })
}

module.exports = dataExtraction
