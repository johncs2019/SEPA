function importJSON() {

    var newArr = [];

    newArr.push(["Timestamp","Value"]);

    for (i = 0; i < obj.length; i++) {
        var rec = obj[i];
        newArr.push([rec["Timestamp"],rec["Value"]]);
    }

    // Logger.clear();
    // Logger.log(newArr[0].length);
    // Logger.log(newArr.length);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet7");
    sheet.clear();
    //var range = sheet.getRange("A1:B1");
    //range.setValues([["Timestamp", "Value"]]);
    sheet.getRange(1, 1, newArr.length, newArr[0].length).setValues(newArr);
}
