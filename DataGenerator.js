console.log(`\nSarcopenia project - Raspberry MQTT - Node.js v${process.versions.node}!`)

const mqtt = require('mqtt')
const argv = require('minimist')(process.argv.slice(2));
console.dir(argv); console.log();

let patient = {
    name : null,
    surname : null,
    sex : null,
    height : null
};
let bia = {
    FM : null,
    FFM : null
};
let acceleration = {
    acceleration_x : null,
    acceleration_y : null,
    acceleration_z : null
}; // m/s^2
let muscle_strenght = null; //grams
const delay = 2000 //ms
const clientId = 'mqtt_unisalento_sarcopenia_s'
const connectUrl = `mqtt://mqtt.eclipseprojects.io:1883`
const topic_bia = 'unisalento/sarcopenia/data/bia'
const topic_acceleration = 'unisalento/sarcopenia/data/acceleration'
const topic_musclestrenght = 'unisalento/sarcopenia/data/muscle_strenght'
const option_connect = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
}
const option_publish = {
    qos: 0,
    retain: false
}

const sleep = (ms) => {
    const startPoint = new Date().getTime()
    while (new Date().getTime() - startPoint <= ms) {/* wait */}
}

/*
Here I introduce a method that can be used to generate random numbers drawn from a normal distribution.
The code below uses the Box-Muller transform to make sure the numbers are normally distributed.
*/
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

/* the following functions generate sensors data (bia/gaitSpeed/muscleStrenght) */

function biaMeasureGenerator(meanFM, meanFFM, stddevFM, stddevFFM) {
    bia.FM = getNormallyDistributedRandomNumber(meanFM, stddevFM)
    bia.FFM = getNormallyDistributedRandomNumber(meanFFM, stddevFFM)
    console.log("FM = " + bia.FM)
    console.log("FFM = " + bia.FFM)
    return `{ "bia_FM" : ${bia.FM}, "bia_FFM" : ${bia.FFM} }`
}

function gaitSpeedMeasureGenerator(mean_X, mean_Y, mean_Z, stddev_X, stddev_Y, stddev_Z) {
    acceleration.acceleration_x = getNormallyDistributedRandomNumber(mean_X, stddev_X)
    acceleration.acceleration_y = getNormallyDistributedRandomNumber(mean_Y, stddev_Y)
    acceleration.acceleration_z = getNormallyDistributedRandomNumber(mean_Z, stddev_Z)
    console.log("acc_x = " + acceleration.acceleration_x)
    console.log("acc_y = " + acceleration.acceleration_y)
    console.log("acc_z = " + acceleration.acceleration_z)
    return `{ "acc_x" : ${acceleration.acceleration_x}, 
    "acc_y" : ${acceleration.acceleration_y},
    "acc_z" : ${acceleration.acceleration_z} }`
}

function muscleStrenghtMeasureGenerator(mean_MS, stddev_MS){
    muscle_strenght = getNormallyDistributedRandomNumber(mean_MS, stddev_MS)
    console.log("muscle_strenght = " + muscle_strenght)
    return `{ "muscle_strenght" : ${muscle_strenght} }`
}

// ----------------------------------MQTT DATA SEND---------------------------------------------------------------------


const client = mqtt.connect(connectUrl, option_connect)

client.on("connect",function(){
    console.log("Connected");
});
client.on("error",function(error){
    console.log("Can't connect" + error);
});

setInterval(function () {
        client.publish(topic_bia, biaMeasureGenerator(20,50,1, 1) , option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);

setInterval(function () {
        client.publish(topic_acceleration, gaitSpeedMeasureGenerator(1.2 , 0.1, 0.1, 0.5, 0.05, 0.05), option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);

setInterval(function () {
        client.publish(topic_musclestrenght, muscleStrenghtMeasureGenerator(10 , 1) , option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);
