const mrzService = require('../services/mrz.service');
module.exports = (req, res, next)=>{
    if(req.mrzLines.length == 3){
        req.mrzLines[0] = req.mrzLines[0].substring(0, 44)
        req.mrzLines[1] = req.mrzLines[1].substring(0, 30)
        req.mrzLines[2] = req.mrzLines[2].substring(0, 30)

        let data = mrzService.mrzRecoginze(req.mrzLines)
        
        let filteredData = mrzService.filterDataId(data)
        
        return res.json({data : filteredData, message : "data successfuly extracted", response : 200, success : true})
    }
    return next({code : 400, message : 'please enter a valid documnet'})
}