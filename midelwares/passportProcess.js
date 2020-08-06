const mrzService = require('../services/mrz.service');

let fillLine = (line)=>{
    while (line.length < 44) {
        line += "<"
    }
    return line
}

module.exports = async (req, res, next)=>{
    if(req.mrzLines.length != 2){
        mrzService.clearTemp()
        return next()
    }
    if(req.mrzLines[0].length < 44){
        req.mrzLines[0] = fillLine(req.mrzLines[0])
    }
    if(req.mrzLines[1].length < 44){
        req.mrzLines[1] = fillLine(req.mrzLines[1])
    }
    req.mrzLines[0] = req.mrzLines[0].substring(0, 44)
    req.mrzLines[1] = req.mrzLines[1].substring(0, 44)

    let filteredData = mrzService.mrzRecoginze(req.mrzLines)
    filteredData = mrzService.filterDataId(filteredData, req.mrzLines)

    mrzService.clearTemp()
    return res.json({data : filteredData, message : "data successfuly extracted", response : 200, success : true})
}