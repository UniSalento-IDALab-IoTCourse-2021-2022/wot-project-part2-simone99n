console.log(`\nSARCOPENIA PROJECT - Raspberry MQTT - Norberti Simone - Node.js v${process.versions.node}!\n`)

const mqtt = require('mqtt')

const argv = process.argv
let patient = 1 //default patient 1
let anomaly = false //default no anomaly

if (argv[2] === '--patient1' || argv[3] === '--patient1' )
    patient = 1
if (argv[2] === '--patient2' || argv[3] === '--patient2' )
    patient = 2
if (argv[2] === '--patient3' || argv[3] === '--patient3' )
    patient = 3
if (argv[2] === '--anomaly' || argv[3] === '--anomaly' )
    anomaly = true
console.log("patient = " + patient)
console.log("anomaly = " + anomaly + "\n")
//TODO implement 3 different patient
//TODO implement anomalies

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
    while (new Date().getTime() - startPoint <= ms) {/* wait */
    }
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
    return {z0, z1};
}

//mapping (0,1) --> (mean, stddev)
function getNormallyDistributedRandomNumber(mean, stddev) {
    const {z0, _} = boxMullerTransform();
    return z0 * stddev + mean
}

/* the following functions generate sensors data (bia/gaitSpeed/muscleStrenght) */

function biaMeasureGenerator(meanFM, meanFFM, stddevFM, stddevFFM) {
    let FM = getNormallyDistributedRandomNumber(meanFM, stddevFM)
    let FFM = getNormallyDistributedRandomNumber(meanFFM, stddevFFM)
    console.log("FM = " + FM)
    console.log("FFM = " + FFM)
    return `{ "bia_FM" : ${FM}, "bia_FFM" : ${FFM} }`
}

function gaitSpeedMeasureGenerator(mean_X, mean_Y, mean_Z, stddev_X, stddev_Y, stddev_Z) {
    let acceleration_x = getNormallyDistributedRandomNumber(mean_X, stddev_X)
    let acceleration_y = getNormallyDistributedRandomNumber(mean_Y, stddev_Y)
    let acceleration_z = getNormallyDistributedRandomNumber(mean_Z, stddev_Z)
    console.log("acc_x = " + acceleration_x)
    console.log("acc_y = " + acceleration_y)
    console.log("acc_z = " + acceleration_z)
    return `{ "acc_x" : ${acceleration_x}, 
    "acc_y" : ${acceleration_y},
    "acc_z" : ${acceleration_z} }`
}

function muscleStrenghtMeasureGenerator(mean_MS, stddev_MS) {
    let muscle_strenght = getNormallyDistributedRandomNumber(mean_MS, stddev_MS)
    console.log("muscle_strenght = " + muscle_strenght + "\n")
    return `{ "muscle_strenght" : ${muscle_strenght} }`
}

// ----------------------------------MQTT DATA SEND---------------------------------------------------------------------
const client = mqtt.connect(connectUrl, option_connect)

client.on("connect", function () {
    console.log("[MQTT] Connected");
});
client.on("error", function (error) {
    console.log("Can't connect" + error);
});

setInterval(function () {
        client.publish(topic_bia, biaMeasureGenerator(20, 50, 1, 1), option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);

setInterval(function () {
        client.publish(topic_acceleration, gaitSpeedMeasureGenerator(1.2, 0.1, 0.1, 0.5, 0.05, 0.05), option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);

setInterval(function () {
        client.publish(topic_musclestrenght, muscleStrenghtMeasureGenerator(10, 1), option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }, delay
);
