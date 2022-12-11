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
//TODO implement 5 different kind of measurement sessions with anomalies (plot the results all together)
//TODO implement anomalies

const delay = 2000 //ms
const clientId = 'mqtt_unisalento_sarcopenia_s'
const connectUrl = `mqtt://mqtt.eclipseprojects.io:1883`
const topic = 'unisalento/sarcopenia/sensorData'

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

function measureGenerator(meanFM, meanFFM, stddevFM, stddevFFM,
                             mean_X, mean_Y, mean_Z, stddev_X, stddev_Y, stddev_Z,
                             mean_MS, stddev_MS) {

    let FM = getNormallyDistributedRandomNumber(meanFM, stddevFM).toFixed(2)
    let FFM = getNormallyDistributedRandomNumber(meanFFM, stddevFFM).toFixed(2)
    console.log("FM = " + FM + "   FFM = " + FFM)
    let acceleration_x = getNormallyDistributedRandomNumber(mean_X, stddev_X).toFixed(2)
    let acceleration_y = getNormallyDistributedRandomNumber(mean_Y, stddev_Y).toFixed(2)
    let acceleration_z = getNormallyDistributedRandomNumber(mean_Z, stddev_Z).toFixed(2)
    console.log("acc_x = " + acceleration_x + "   acc_y = " + acceleration_y + "   acc_z = " + acceleration_z)
    let muscle_strenght = getNormallyDistributedRandomNumber(mean_MS, stddev_MS).toFixed(2)
    console.log("muscle_strenght = " + muscle_strenght + "\n")

    return `{ "bia": { "bia_FM" : ${FM}, "bia_FFM" : ${FFM} },
    "acc": { "acc_x" : ${acceleration_x}, "acc_y" : ${acceleration_y}, "acc_z" : ${acceleration_z} },
    "muscle_strenght" : ${muscle_strenght} }`
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
        client.publish(topic, measureGenerator(20, 50, 1, 1,
            1.2, 0.1, 0.1, 0.5, 0.05, 0.05,
            10, 1),
            option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })

    }, delay
);

