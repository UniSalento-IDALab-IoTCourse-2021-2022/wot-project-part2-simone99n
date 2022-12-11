console.log(`\nSARCOPENIA PROJECT - Raspberry MQTT - Norberti Simone - Node.js v${process.versions.node}!\n`)

const mqtt = require('mqtt')
const fs = require("fs");
const { parse } = require("csv-parse");

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


let data = fs.readFileSync("./data.csv", "utf8");
data = data.split("\n")
for (let i = 0; i<data.length; i++) { data[i] = data[i].split(",") } // split data in 3D array



// genera coppie di numeri casuali indipendenti e distribuiti gaussianamente con media nulla e varianza unitaria
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

// ID, Sex ,Sarcopenia, Age,BMI, Risk & Malnutrition, Gait_Speed, Grip_Strength, Muscle mass
function measureGenerator(data_raw) {
    const id = parseFloat(data_raw[0])
    const sex = parseFloat(data_raw[1])
    const sarcopenia = parseFloat(data_raw[2])
    const age = parseFloat(data_raw[3])
    const bmi = parseFloat(data_raw[4])
    const risk_malnutrition = parseFloat(data_raw[5])
    const gait_speed = parseFloat(data_raw[6])
    const grip_strength = parseFloat(data_raw[7])
    const muscle_mass = parseFloat(data_raw[8])

    const gait_speed_tosend = getNormallyDistributedRandomNumber(gait_speed, 0.01).toFixed(2)
    const grip_strength_tosend = getNormallyDistributedRandomNumber(grip_strength, 0.01).toFixed(2)
    const muscle_mass_tosend = getNormallyDistributedRandomNumber(muscle_mass, 0.01).toFixed(2)

    console.log("\ngait_speed = " + gait_speed_tosend)
    console.log("grip_strength = " + grip_strength_tosend)
    console.log("muscle_mass = " + muscle_mass_tosend)

    return `{ "gait_speed": ${gait_speed_tosend}, "grip_strength": ${grip_strength_tosend}, "muscle_mass" : ${muscle_mass_tosend} }`
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
        client.publish(topic, measureGenerator(data[1]),
            option_publish, (error) => {
                if (error) {
                    console.error(error)
                }
            })

    }, delay
);

