function alert(message) {
  ui = SpreadsheetApp.getUi();
  ui.alert(message);
}

function getStationID(isBotanics) {
  return (15196 + (!isBotanics ? 0 : 5));
}

function getURLPart(period) {
  return (period == 0 ? "Hourly" : (period == 1 ? "Daily" : "Month"));
}

function getSheetName(isBotanics, period) {
  return ((isBotanics ? "Botanics" : "Gogarbank") + " " + getURLPart(period));
}

function getSpreadSheet(isBotanics, period) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(getSheetName(isBotanics, period));
}

function getURL(isBotanics, period) {
  return ("https://www2.sepa.org.uk/rainfall/api/" + getURLPart(period) + "/" + getStationID(isBotanics) + "?&all=true");
}

function getResponse(isBotanics, period) {
  return UrlFetchApp.fetch(getURL(isBotanics, period), {method : "get", payload : "", "muteHttpExceptions" : true});
}

function getData(content) {
  return JSON.parse(content);
}

function getHeadings(period) {
  var newArr = [(period === 2 ? "Month" : (period === 1 ? "Date" : "Time")) + " of Observation"]
  if (period === 0) {
    newArr.push("Date of Observation");
  }
  newArr.push("Rainfall")
  if (period === 1) {
    newArr.push("Is Dry");
    newArr.push("Is Rain Day");
  }
  return newArr
}

function fixRecord(rec, period) {
  var obs = new Observation(rec.Timestamp, rec.Value, period);
  var newArr = [];
  if (!(obs.isDaily(period) || obs.isMonthly(period))) {
    newArr.push(obs.ObservationTime.getFullDateTime());
  }
  if (obs.isMonthly(period)) {
    newArr.push(obs.ObservationDate.getMonthYear());
  } else {
    newArr.push(obs.ObservationDate.getFullDate());
  }
  newArr.push(obs.Rainfall);
  if (obs.isDaily(period)) {
    newArr.push(obs.isDry);
    newArr.push(obs.isRainDay);
  }

  return newArr;
}

function fixAllData(data, period) {
  let newArr = [];
  newArr.push(getHeadings(period));

   for (var i = 0; i < data.length; i++) {
    newArr.push(fixRecord(data[i], period))
  }

  return newArr;
}

function updateSheet(sheet, data) {
  sheet.clear();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function importJSONFromWeb(isBotanics) {

  for (var period = 0; period <= 2; period++) {
    
    var response = getResponse(isBotanics, period);
    
    if (typeof(response) !== "undefined") {
      var JSONData = getData(response.getContentText());
      var data = fixAllData(JSONData, period);
 
      try {
        updateSheet(getSpreadSheet(isBotanics, period), data);
      }
      catch(err) {
        alert("An Error has occurred whilst trying to update the spreadsheet.");
      }
      
    } else {
      alert("Cannot access the SEPA server, you may have gone off-line.");
    }
  }
}

function importGogarbank() {
  importJSONFromWeb(false);
}

function importBotanics() {
  importJSONFromWeb(true);
}

function getAllData() {
  Logger.clear();
  importGogarbank();
  importBotanics();
}

