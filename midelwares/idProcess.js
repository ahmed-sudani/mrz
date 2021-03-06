const mrzService = require('../services/mrz.service');

module.exports = async (req, res, next)=>{
    if(req.mrzLines.length == 3){
        
        req.mrzLines[0] = req.mrzLines[0].substring(0, 44)
        req.mrzLines[1] = req.mrzLines[1].substring(0, 30)
        req.mrzLines[2] = req.mrzLines[2].substring(0, 30)

        try {
            let data = mrzService.mrzRecoginze(req.mrzLines)
            let filteredData = mrzService.filterDataId(data, "", "id")
            
            return res.json({data : filteredData, message : "data successfuly extracted", response : 200, success : true})   

        } catch (error) {
            next({path : "id" , code : 400, message : 'please enter a valid documnet'})
        }
    }
    return next({path : "id", code : 400, message : 'please enter a valid documnet'})
}