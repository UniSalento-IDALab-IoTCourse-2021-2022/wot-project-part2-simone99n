const fs = require("fs");
const { parse } = require("csv-parse");

var patient = {
    name : null,
    surname : null,
    sex : null,
    height : null
};
var muscle_strenght = null; //grams
var acceleration = {
    acceleration_x : null,
    acceleration_y : null,
    acceleration_z : null
}; // m/s^2
var bia_measure = {
    FM : null,
    FFM : null
};

fs.createReadStream("./dataset.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        console.log(row);
    })