const mrzService = require('../services/mrz.service');
const {exec} = require("child_process");

module.exports = (req, res, next)=>{
    if(req.mrzLines.length != 2){
        mrzService.clearTemp()
        return next()
    }
    exec("mrz --json temp/passport-image.jpg", (error, stdout, stderr)=>{
        if (error) {
            mrzService.clearTemp()
            next({code : 400, message : 'please enter a valid documnet'})
        } else if(stdout){
            let data = JSON.parse(stdout)
            let filteredData = mrzService.filterDataPassport(data, req.mrzLines)
            mrzService.clearTemp()
            return res.json({data : filteredData, message : "data successfuly extracted", response : 200, success : true})
        }
    })
}