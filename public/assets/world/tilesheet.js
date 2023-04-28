const tileSiz = 32;

const sheetRows = 12;
const sheetCols = 14;
const sheetSize = 168;

const tileSheet = new Array(sheetSize);

var tileX;
var tileY;

var tileCoords = [];

for(let y = 0; y < sheetRows; y++) {
    for (let x = 0; x < sheetCols; x++) {
        tileCoords[0] = x * tileSiz;
        tileCoords[1] = y * tileSiz;
        tileSheet.push.apply(tileSheet, tileCoords);
    }
}