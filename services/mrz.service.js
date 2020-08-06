const fs = require('fs');
const mrz = require('mrz');
class mrzService{

  filterString(text = ""){
    let textmrz = text.split("\n")
      let filter = []
      for (let i = 0; i < textmrz.length; i++) {
        if(textmrz[i].search("<<") != -1){
          filter.push(textmrz[i])
          if(textmrz[i+1] != "\f" && textmrz[i+1]){
            filter.push(textmrz[i+1])
          }
          if(textmrz[i+2] != "\f" && textmrz[i+2]){
            filter.push(textmrz[i+2])
          }
          break
        }
      }
      return filter
  }

  readCountriesFile(){
    let mrzBuffer = fs.readFileSync("./services/countries.json")
    let data = JSON.parse(mrzBuffer)
    return data
  }

  getCountry(countries = [], countryCode = "", type = ""){
    for(let i = 0; i < countries.length; i++) {
      let element = countries[i]
      if(element["alpha-3"] == countryCode){
        if(type === "N")
        element["name"] = element["name"].charAt(element["name"].length - 1) == 'n' ? element["name"] + 'ese' : element["name"] + 'n'
        return element["name"].trim()
      }
    }
  }

  cleanName(name = ""){
    if(!name)return
    name.trim()
    let ch = name.search(" ")
    return ch != -1 ? name.substring(0, ch + 1).trim() : name.trim()
  }

  formaletDate(date = ""){
    if(!date)return
    return `${date.substr(4, 2)}-${date.substr(2, 2)}-${date.substr(0, 2)}`
  }

  filterNumber(number = ""){
    return number.replace(/[<]/g, '')
  }

  getNamesFromMrz(mrzLines = [""]){
    let names = mrzLines[0].split(/</g)
    return names.filter((ele)=>{return ele != ''})
  }
  
  mrzRecoginze(mrzLines){
    return mrz.parse(mrzLines).fields
  }

  filterDataId(data, mrzLines = "", type){
    let countries = this.readCountriesFile()
    if(mrzLines){
      let names = this.getNamesFromMrz(mrzLines)
      data["firstName"] = names[2]
    }
    if(!data["lastName"] && !mrzLines){
      let names = data["firstName"].split(" ")
      data["firstName"] = names[0]
      data["lastName"] = names[1]
    }

    let info = {
      type : type,
      first_name : this.cleanName(data["firstName"]),
      last_name : this.cleanName(data["lastName"]),
      expiration_date : this.formaletDate(data["expirationDate"]),
      date_of_birth : this.formaletDate(data["birthDate"]),
      nationality : this.getCountry(countries, data['nationality'], 'N'),
      sex : data["sex"],
      documentNumber: data["documentNumber"],
      issuingState : data["issuingState"],
      personalNumber: data["personalNumber"]
    }
    return info
  }

  clearTemp(){
    fs.unlinkSync("./temp/passport-image.jpg")
  }

}
 module.exports =  new mrzService()
