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
  return ("https://www2.sepa.org.uk/rainfall/api/" + getURLPart(period) + "/" + getStationID(isBotanics) + "?csv=true&all=true");
}

function getResponse(isBotanics, period) {
  return UrlFetchApp.fetch(getURL(isBotanics, period), {method : "get", payload : "", "muteHttpExceptions" : true});
}

function getData(response) {
  if (response) {
    return Utilities.parseCsv(response.getContentText());
  } else {
    return undefined;
  }
}

function updateSheet(sheet, data) {
  sheet.clear();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function importCSVFromWeb(isBotanics) {

  for (var period = 0; period <= 2; period++) {
    // Provide the full URL of the CSV file.
    
    var CsvData = getData(getResponse(isBotanics, period));
    
    if (CsvData != undefined) {
      try {
        updateSheet(getSpreadSheet(isBotanics, period), CsvData);
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
  importCSVFromWeb(false);
}

function importBotanics() {
  importCSVFromWeb(true);
}

function getAllData() {
  Logger.clear();
  importGogarbank();
  importBotanics();
}

