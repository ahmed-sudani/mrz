const fs = require('fs');
const mrz = require('mrz');
const { count } = require('console');
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
        if(type == "N"){
          return element["name"].charAt(element["name"].length - 1) == 'n' ? element["name"] + 'ese' : element["name"] + 'n'
        }
        return element["name"].trim()
      }
    }
    return countryCode
  }

  cleanName(name = ""){
    if(!name)return
    name = name.replace(/[0-9]/g, "")
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

  readCountry(line){
    let index = line.search(/[a-zA-Z]{3}/)
    if(index != -1)
    return line.substr(index, 3)
  }

  readDocumentNumber(line){
    return line.substr(0, 9)
  }

  readGender(line){
    let index = line.search(/[FM]{1}/)
    if(index != -1)
    return line.substr(index, 1)
  }

  readDates(line){
    let dates = []
    let index = line.search(/[a-zA-Z]{3}/) + 3
    dates[0] = line.substr(index, 6)
    index = line.search(/[FM]{1}/) + 1
    dates[1] = line.substr(index, 6)
    return dates
  }

  readPersonalNumber(line){
    let startIndex = line.search(/[FM]{1}/) + 8
    let endIndex = line.indexOf("<", startIndex)
    endIndex = endIndex == -1 ? line.length - 2 : endIndex 
    return line.substring(startIndex, endIndex)
  }

  filterStateFromName(name = "", state = ""){
    let count = 0
    name = name.replace(/[0-9]/g, "")
    for(let i = 0; i < 3; i++){
      if(name.charAt(i) == state.charAt(i)){
        count++
      }
    }
    if(count >= 2){
      return name.substr(3, name.length)
    }
    return name
  }

  filterDataId(data, mrzLines = "", type){
    let countries = this.readCountriesFile()

    if(mrzLines){
      
      data["nationality"] = this.readCountry(mrzLines[1])
      data["sex"] = this.readGender(mrzLines[1]) == "M" ? "male" : "female"

      let names = this.getNamesFromMrz(mrzLines)
      data["firstName"] = names[2]
      data["lastName"] = this.filterStateFromName(names[1] , data['nationality'])
      
      let dates = this.readDates(mrzLines[1])
      data["birthDate"] = dates[0]
      data["expirationDate"] = dates[1]

      data["documentNumber"] = this.readDocumentNumber(mrzLines[1])
      data["personalNumber"] = this.readPersonalNumber(mrzLines[1])
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
      country : this.getCountry(countries, data['nationality'], "C"),
      sex : data["sex"],
      documentNumber: this.filterNumber(data["documentNumber"]),
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