export function tile(tileIndex) {
    const tileSiz = 32;
    const sheetRows = 12;
    const sheetCols = 14;
    var tileSheetArray = new Array();
    
    for(var y = 0; y < sheetRows; y++) {
        for (var x = 0; x < sheetCols; x++) {
            let tileCoords = new Array(2);
            tileCoords[0] = x * tileSiz;
            tileCoords[1] = y * tileSiz;
            tileSheetArray.push(tileCoords);
        }
    }

    return tileSheetArray[tileIndex], tileSheetArray[tileIndex][0], tileSheetArray[tileIndex][1];
}
