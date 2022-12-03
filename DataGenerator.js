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

async function biaMeasureGenerator(mean, stddev, timeout){
    for(let i = 0; i < 10; i++) {
        const result = await getNormallyDistributedRandomNumber(mean, stddev, timeout);
        console.log(result)
    }
}

biaMeasureGenerator(1.2 , 0.1, 1000)


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
function getNormallyDistributedRandomNumber(mean, stddev, timeout) {
    const { z0, _ } = boxMullerTransform();

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(z0 * stddev + mean);
        }, 1000);
    });


   // return z0 * stddev + mean;

}