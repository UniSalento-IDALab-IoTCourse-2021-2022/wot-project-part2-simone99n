console.log(`\nSARCOPENIA PROJECT - Raspberry MQTT - Norberti Simone - Node.js v${process.versions.node}!\n`)

const fs = require('fs');
const csv = require('csv-parser');
const mqtt = require("mqtt");

// inizilizzazione parametri
const delay = 5000 //ms
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

// Funzione per selezionare casualmente una riga dal file CSV
function randomRow(rows) {
    return rows[Math.floor(Math.random() * rows.length)];
}

// Funzione principale per leggere il file CSV e selezionare i tre attributi
function readCsv() {
    const rows = [];
    let random;
    // Leggi il file CSV
    fs.createReadStream('data2.csv')
        .pipe(csv())
        .on('data', (data) => {
            // Aggiungi la riga all'array
            rows.push({
                Gait_Speed: data.Gait_Speed,
                Grip_Strength: data.Grip_Strength,
                Muscle_mass: data.Muscle_mass
            });
        })
        .on('end', () => {
            // Seleziona casualmente una riga e stampa i tre attributi
            random = randomRow(rows);
            console.log(random);
            console.log();
            //console.log(random.Gait_Speed, random.Grip_Strength, random.Muscle_mass);

            client.publish(topic, `{'GAIT_SPEED': ${random.Gait_Speed}, 'GRIP_STRENGHT': ${random.Grip_Strength}, 'MUSCLE_MASS': ${random.Muscle_mass}}`,
                option_publish, (error) => {
                    if (error) {
                        console.error(error)
                    }
                })

        });
}

const client = mqtt.connect(connectUrl, option_connect)

client.on("connect", function () {
    console.log("[MQTT] Connected");
});
client.on("error", function (error) {
    console.log("Can't connect" + error);
});

setInterval(readCsv, delay);

/*
setInterval(function () {
        client.publish(topic, readCsv(),
            option_publish, (error) => {
                if (error) {
                    console.error(error)
                }
            })

    }, delay
);

 */