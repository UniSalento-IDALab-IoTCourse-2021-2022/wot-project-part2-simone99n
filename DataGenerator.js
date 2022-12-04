// const fs = require("fs");
// const { parse } = require("csv-parse");

var patient = {
    name : null,
    surname : null,
    sex : null,
    height : null
};
var bia_measure = {
    FM : null,
    FFM : null
};

var acceleration = {
    acceleration_x : null,
    acceleration_y : null,
    acceleration_z : null
}; // m/s^2

var muscle_strenght = null; //grams




const sleep = (ms) => {
    const startPoint = new Date().getTime()
    while (new Date().getTime() - startPoint <= ms) {/* wait */}
}

// Here I introduce a method that can be used to generate random numbers drawn from a normal distribution.
// The code below uses the Box-Muller transform to make sure the numbers are normally distributed.

// metodo per generare coppie di numeri casuali indipendenti e distribuiti gaussianamente con media nulla e varianza uno
function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return { z0, z1 };
}

//mapping (0,1) --> (mean, stddev)
function getNormallyDistributedRandomNumber(mean, stddev) {
    const { z0, _ } = boxMullerTransform();
    return z0 * stddev + mean
}

function biaMeasureGenerator(meanFM, meanFFM, stddevFM, stddevFFM) {
    bia_measure.FM = getNormallyDistributedRandomNumber(meanFM, stddevFM)
    bia_measure.FFM = getNormallyDistributedRandomNumber(meanFFM, stddevFFM)
    console.log("FM = " + bia_measure.FM)
    console.log("FFM = " + bia_measure.FFM)
}

function gaitSpeedMeasureGenerator(mean_X, mean_Y, mean_Z, stddev_X, stddev_Y, stddev_Z) {
    acceleration.acceleration_x = getNormallyDistributedRandomNumber(mean_X, stddev_X)
    acceleration.acceleration_y = getNormallyDistributedRandomNumber(mean_Y, stddev_Y)
    acceleration.acceleration_z = getNormallyDistributedRandomNumber(mean_Z, stddev_Z)
    console.log("acc_x = " + acceleration.acceleration_x)
    console.log("acc_y = " + acceleration.acceleration_y)
    console.log("acc_z = " + acceleration.acceleration_z)
}

function muscleStrenghtMeasureGenerator(mean_MS, stddev_MS){
    muscle_strenght = getNormallyDistributedRandomNumber(mean_MS, stddev_MS)
    console.log("muscle_strenght = " + muscle_strenght)
}

console.log("---INIZIO---")
delay = 500 //ms
for (let i = 0; i < 10; i++){
    sleep(delay)
    biaMeasureGenerator(20 , 50, 1, 1)
    gaitSpeedMeasureGenerator(1.2 , 0.1, 0.1, 0.5, 0.05, 0.05)
    muscleStrenghtMeasureGenerator(10 , 1)
    console.log("")
}
console.log("---FINE---")
