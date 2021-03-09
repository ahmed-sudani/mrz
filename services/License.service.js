const statesAppreviations = require("./states").stateApreviations;
const regs = require("./regs");

class LicenseService {
  licenseData = require("./license.obj");
  filteredData = [];
  wordsToSearchNear = {};

  filterArray(arr = [""]) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      let data = arr[i];
      data = data
        .replace(/[^\w ]|[_]/g, "")
        .trim()
        .toUpperCase();
      data = data.replace(/  /g, " ");
      if (
        data &&
        data.length > 3 &&
        !data.includes("\f") &&
        data.search(/[a-zA-Z0-9]/) >= 0
      ) {
        result.push(data);
      }
    }
    return result;
  }
  filterData(...data) {
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      this.filteredData.push(this.filterArray(item.split("\n")));
    }
    this.filteredData.forEach((item) => {
      console.log(item);
    });

    this.licenseData.state = this.getTextInNextLine([
      0,
      regs.STATES,
      0,
      3,
      "STATE",
    ]);
    if (this.licenseData.state) {
      this.licenseData.state = this.licenseData.state.trim();
    } else return;
    console.log(this.licenseData.state, "***********");
    this.licenseData.state = statesAppreviations[this.licenseData.state];
    console.log(this.licenseData.state);

    let license = this.readLicenseFile()[this.licenseData.state];
    this.licenseData.family_name = this.getTextInNextLine(license.family_name);
    this.licenseData.given_name = this.getTextInNextLine(license.given_name);
    this.licenseData.address = this.getTextInNextLine(license.address);
    this.licenseData.date_of_birth = this.getTextInNextLine(
      license.date_of_birth
    );
    this.licenseData.DD = this.getTextInNextLine(license.DD);
    this.licenseData.date_of_exp = this.getTextInNextLine(license.date_of_exp);
    this.licenseData.date_of_issue = this.getTextInNextLine(
      license.date_of_issue
    );
    this.licenseData.id = this.getTextInNextLine(license.id);
    this.licenseData.weight = this.getTextInNextLine(license.weight);
    this.licenseData.class = this.getTextInNextLine(license.class);
    this.licenseData.gender = this.getTextInNextLine(license.gender);

    if (this.licenseData.date_of_birth)
      this.licenseData.date_of_birth = this.formateDate(
        this.licenseData.date_of_birth
      );
    if (this.licenseData.date_of_exp)
      this.licenseData.date_of_exp = this.formateDate(
        this.licenseData.date_of_exp
      );
    if (this.licenseData.date_of_issue)
      this.licenseData.date_of_issue = this.formateDate(
        this.licenseData.date_of_issue
      );
    this.licenseData.family_name = this.cleanText(this.licenseData.family_name);
    this.licenseData.given_name = this.cleanText(this.licenseData.given_name);
    return this.licenseData;
  }
  cleanText(text = "") {
    let name = text.split(" ");
    text = "";
    name.forEach((element) => {
      element = element.replace(/[ ][0-9][ ]|[0-9]/g, "");
      if (element.length > 3) text += " " + element;
    });
    return text.trim();
  }
  readLicenseFile() {
    let fs = require("fs");
    let license = fs.readFileSync("./services/license.data.json");
    let data = JSON.parse(license);
    return data;
  }
  getTextInNextLine(props = [], data = this.filteredData) {
    if (!props) {
      return;
    }
    let lineIndex = props[0] ? props[0] : 0,
      expectedWordToSearchNear = props[1] ? props[1] : "",
      addToWordLineIndex = props[2],
      textLength = props[3] ? props[3] : 0,
      regex = regs[props[4]],
      minIndex = props[5],
      maxIndex = props[6],
      nextLineIncluded = props[7];
    let resultText,
      usedLineIndex = lineIndex;

    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      const element = data[dataIndex];
      usedLineIndex = this.getWordLineIndex(element, expectedWordToSearchNear);
      if (usedLineIndex != -1) {
        usedLineIndex += addToWordLineIndex;
        resultText = this.substring(
          data[dataIndex][usedLineIndex],
          regex,
          textLength,
          minIndex,
          maxIndex,
          addToWordLineIndex == 0 ? expectedWordToSearchNear : ""
        );
        if (!resultText) {
          continue;
        }
        if (nextLineIncluded && data[dataIndex][usedLineIndex + 1]) {
          resultText += " " + data[dataIndex][usedLineIndex + 1].substr(0);
        }
        return resultText;
      }
    }
  }

  indexFound(line = "", word = "") {
    if (word.length >= 4)
      for (let i = 0; i + 4 <= word.length; i++) {
        if (line.search(word.substr(i, 4)) != -1) {
          return true;
        }
      }
    return line.search(word) != -1;
  }

  getWordLineIndex(data = [""], expextedWord = "") {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (this.indexFound(element, expextedWord)) {
        return i;
      }
    }
    return -1;
  }

  substring(
    fullText = "",
    regex,
    expextedLength,
    minIndex = -1,
    maxIndex = -1,
    expextedWord = ""
  ) {
    let text = fullText;
    if (minIndex != -1) {
      text = fullText.substr(minIndex);
    }
    if (maxIndex != -1) {
      text = fullText.substring(0, maxIndex);
    }
    if (expextedWord) {
      text = text.substr(text.search(expextedWord) + expextedWord.length);
    }
    if (!regex) {
      return text.substr(0);
    }
    let index = text.search(regex);
    if (index == -1) {
      return undefined;
    }
    return text.substr(
      index,
      expextedLength != -1 ? expextedLength : fullText.length
    );
  }

  formateDate(text = "") {
    return (
      text.substr(0, 2) + "-" + text.substr(2, 2) + "-" + text.substr(4, 4)
    );
  }
}

module.exports = LicenseService;
